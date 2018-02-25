import React, {Component} from 'react'
import {
	Editor,
	EditorState,
	SelectionState,
	convertFromRaw,
	convertToRaw,
	getDefaultKeyBinding,
	Modifier
} from 'draft-js';
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types';
import equal from 'fast-deep-equal';
import {compose} from 'recompose';

import 'draft-js/dist/Draft.css'
import './BlockStyles.css'

import willUploadImage from '../../lib/ImageUpload'
import willExtractOrientation from './util/ExtractOrientation'
import willExtractSize from './util/ExtractSize'
import insertAtomicBlock from './util/insertAtomicBlock'
import client from '../../graphql/graphql';
import {DRAFT_IMAGE_ARRAY_QUERY} from '../../graphql/draft';
import {WithUpdateContentMutation, WithUpdateCoverMuation} from '../../graphql/draft';

import EmojiInsert from './sidebar/EmojiInsert'
import ImageInsert from './sidebar/ImageInsert'
import VideoInsert from './sidebar/VideoInsert'
import TitleInsert from './sidebar/TitleInsert'
import SubTitleList from './sidebar/SubTitleList'

import SequenceAdjustor from './SequenceAdjustor/SequenceAdjustor'
import ScrollTools from './ScrollTools'

import {defaultDecorator} from './decorators/defaultDecorator'
import Atomic from './atomicblock/Atomic'
import defaultPlugins from './plugins/default'
import CONSTS from '../../lib/consts'
import searchImage from '../../lib/searchImage'

const PLACEHOLDERTEXT = "Your story starts here"
const BUCKET_NAME = CONSTS.BUCKET_NAME
const DRAFT_WIDTH = CONSTS.DRAFT_WIDTH
const VIDEO_WIDTH = CONSTS.DRAFT_WIDTH
const VIDEO_HEIGHT = VIDEO_WIDTH * 9 / 16
const SUBTITLE_HEIGHT = CONSTS.SUBTITLE_HEIGHT

class MyEditor extends Component {

	constructor(props) {
		super(props)
		this.state = {
			editorState: this.props.startingContent
				? EditorState.set(
					EditorState.createWithContent(convertFromRaw(this.props.startingContent), defaultDecorator),
					{allowUndo: false}
				)
				: EditorState.set(
					EditorState.createEmpty(defaultDecorator),
					{allowUndo: false}
				),
			images: this.props.startingImages
				? this.props.startingImages
				: undefined,
			subTitleList: this.props.startingContent
				? getSubTitleList(convertFromRaw(this.props.startingContent))
				: undefined,
			titleOpen: false,
			titleBlockKeyOnEdit: '',
			currentTitle: ''
		}
		// EditorState.createWithContent(convertFromRaw(initialState))
		// createEditorStateWithText(initialText) EditorState.createEmpty()
		this.plugins = this.getDefaultPlugins(defaultPlugins)

	}

	getDefaultPlugins = (defaultPlugins) => {
		let plugins = {}
		for (let p of defaultPlugins) {
			plugins[p.type] = p
		}
		return plugins
	}

	onClick = () => {
		this.editor.focus()
	}

	onChange = (editorState) => {
		const currentContent = this.state.editorState.getCurrentContent()
		const newContent = editorState.getCurrentContent()
		this.setState({editorState: editorState})
		if (!equal(currentContent, newContent)) {
			this.saveContent(newContent)
		}
	}

	onSequenceChanged = (contentState) => {
		const editorState = EditorState.createWithContent(contentState)
		this.onChange(editorState)
		//update subTitle Elevator
		this.setState({subTitleList: getSubTitleList(contentState)})
	}

	saveContent = debounce((newContent) => {
		console.log(convertToRaw(newContent))
		//console.log("WRITING TO THE SERVER")
		this.props.updateContent(this.props.match.params._id, convertToRaw(newContent))
		// console.log(JSON.stringify(convertToRaw(newContent)))
	}, 2000)

	uploadFile = async (file) => {

		// const origEditorState = this.state.editorState example localImageData
		// {orientation: 8, src: <localURL>}
		let localImageData = await willExtractOrientation(file)
		// example localImageSize {width: 100, height: 100}
		let localImageSize = await willExtractSize(localImageData)

		const width = localImageSize.width > DRAFT_WIDTH
			? DRAFT_WIDTH
			: localImageSize.width
		const height = localImageSize.width > DRAFT_WIDTH
			? localImageSize.height / (localImageSize.width / DRAFT_WIDTH)
			: localImageSize.height

		// Add imagePlaceHolder
		const editorState = this.state.editorState
		const editorStateWithPlaceHolder = insertAtomicBlock(editorState, {
			"type": "imageplaceholder",
			"width": width,
			"height": height
		})

		this.setState({editorState: editorStateWithPlaceHolder})

		// upload image to S3
		const uploadedImage = await willUploadImage(
			file,
			0,
			this.props.match.params._id,
			localImageSize.width,
			localImageSize.height
		)

		let data = this.getCachedDraft()
		data.draft.images.push(uploadedImage)
		client.writeQuery({query: DRAFT_IMAGE_ARRAY_QUERY, data: data})

		// replace imagePlaceHolder with actual image on S3
		const latestEditorState = this.state.editorState
		const latestContentState = latestEditorState.getCurrentContent()
		let placeholderBlock = latestContentState.getBlockMap().filter((block) => {
			return (block.getType() === 'atomic') && (
				block.getData().toObject().type === 'imageplaceholder'
			)
		})
		const placeholderKey = placeholderBlock.first().getKey()
		const selectionState = latestEditorState.getSelection()
		const selectImagePlaceHolder = selectionState.merge(
			{anchorKey: placeholderKey, anchorOffset: 0, focusKey: placeholderKey, focusOffset: 0}
		)
		const contentStateWithReplacedImage = Modifier.setBlockData(
			latestContentState,
			selectImagePlaceHolder,
			{
				"type": "image",
				"_id": uploadedImage._id
			}
		)
		const newEditorState = EditorState.push(
			latestEditorState,
			contentStateWithReplacedImage,
			'change-block-data'
		)
		this.onChange(newEditorState)
	}

	setCoverPhoto = (imageID) => {
		this.props.updateCover(this.props.match.params._id, imageID);
		console.log(
			"Set cover photo of draft: " + this.props.match.params._id + " as image: " +
			imageID
		);
	}

	getCachedDraft = () => {
		let data = client.readQuery({
			query: DRAFT_IMAGE_ARRAY_QUERY,
			variables: {
				draftID: this.props.match.params._id
			}
		});
		// IMAGE ARRAY is data.draft.images
		return data
	}

	addVideoBlock = (url) => {
		const editorState = this.state.editorState
		const newEditorState = insertAtomicBlock(editorState, {
			"type": "video",
			"src": url
		})
		this.onChange(newEditorState)
	}

	addSubTitleBlock = (text) => {
		const editorState = this.state.editorState
		const newEditorState = insertAtomicBlock(editorState, {
			"type": "subTitle",
			"title": text
		})
		this.onChange(newEditorState)

		//update subTitle Elevator
		this.setState({
			subTitleList: getSubTitleList(newEditorState.getCurrentContent())
		})
	}

	openSubTitleEditor = (titleBlockKeyOnEdit, currentTitle) => {
		this.setState(
			{titleOpen: true, titleBlockKeyOnEdit: titleBlockKeyOnEdit, currentTitle: currentTitle}
		)
	}

	closeSubTitleEditor = () => {
		this.setState({titleOpen: false})
	}

	updateSubTitle = (newTitle) => {
		const editorState = this.state.editorState
		const contentState = editorState.getCurrentContent()
		const blockKey = this.state.titleBlockKeyOnEdit
		const newSelection = new SelectionState(
			{anchorKey: blockKey, anchorOffset: 0, focusKey: blockKey, focusOffset: 0}
		)
		const newContentState = Modifier.mergeBlockData(
			contentState,
			newSelection,
			{title: newTitle}
		)
		const newEditorState = EditorState.push(
			editorState,
			newContentState,
			"change-block-data"
		)
		this.onChange(newEditorState)

		const newTitleList = this.state.subTitleList.update(
			this.state.titleBlockKeyOnEdit,
			value => newTitle
		)
		this.setState({subTitleList: newTitleList})
	}

	deleteSubTitle = (blockKey) => {
		const newList = this.state.subTitleList.delete(blockKey)
		this.setState({subTitleList: newList})
	}

	addEmoji = (emojiName) => {
		const emojiString = '{' + emojiName + '}'
		// console.log(emojiString);
		const contantState = this.state.editorState.getCurrentContent()
		const selectionState = this.state.editorState.getSelection()
		const contantStateWithEmoji = Modifier.insertText(
			contantState,
			selectionState,
			emojiString
		)
		const editorStateWithEmoji = EditorState.push(
			this.state.editorState,
			contantStateWithEmoji,
			'insert-characters'
		)
		this.onChange(editorStateWithEmoji)
	}

	myBlockStyleFn = (contentBlock) => {
		const type = contentBlock.getType()
		if (type === 'atomic') {
			return 'myAtomicStyle'
		}
	}

	myBlockRenderer = (contentBlock) => {
		const type = contentBlock.getType()
		if (type === 'atomic') {

			const pluginType = contentBlock.getData().toObject().type
			const plugin = this.plugins[pluginType]
			if (plugin) {
				if (pluginType === "image") {
					const imageData = searchImage(
						contentBlock.getData().toObject()._id,
						this.props.startingImages
					)
					return {
						component: Atomic,
						editable: false,
						props: {
							plugin: plugin,
							onChange: this.onChange,
							editorState: this.state.editorState,
							src: BUCKET_NAME + imageData.browserStoryImage.filename,
							width: imageData.browserStoryImage.size.width,
							height: imageData.browserStoryImage.size.height,
							setAsCoverPhoto: this.setCoverPhoto
						}
					}
				} else if (pluginType === "imageplaceholder") {
					return {
						component: Atomic,
						editable: false,
						props: {
							plugin: plugin
						}
					}
				} else if (pluginType === "video") {
					return {
						component: Atomic,
						editable: false,
						props: {
							plugin: plugin,
							onChange: this.onChange,
							editorState: this.state.editorState,
							width: VIDEO_WIDTH,
							height: VIDEO_HEIGHT
						}
					}
				} else if (pluginType === "subTitle") {
					return {
						component: Atomic,
						editable: false,
						props: {
							plugin: plugin,
							onChange: this.onChange,
							editorState: this.state.editorState,
							openSubTitleEditor: this.openSubTitleEditor,
							deleteSubTitle: this.deleteSubTitle,
							width: DRAFT_WIDTH,
							height: SUBTITLE_HEIGHT
						}
					}
				}
			}
		}
		return null
	}

	myKeyBindingFn = (e) => {
		if (e.keyCode === 8) {
			// console.log("Delete Pressed")
			const selection = this.state.editorState.getSelection()
			const content = this.state.editorState.getCurrentContent()
			const block = content.getBlockForKey(selection.getAnchorKey())
			if (block.getType() === 'atomic') {
				// console.log("Delete Pressed on Atomic")
				return 'do-nothing'
			} else if (selection.isCollapsed() && selection.getAnchorOffset() === 0) {
				let preBlock = content.getBlockBefore(block.getKey())
				if (preBlock && preBlock.getType() === 'atomic') {
					return 'do-nothing'
				}
			}
		}
		return getDefaultKeyBinding(e)
	}

	handleKeyCommand = (command) => {
		if (command === 'do-nothing') {
			return 'handled'
		}
		return 'not-handled'
	}

	handleReturn = (e, editorState) => {
		// console.log("Return Pressed");
		const selection = editorState.getSelection()
		// console.log(selection.getAnchorKey())
		const content = editorState.getCurrentContent()
		const block = content.getBlockForKey(selection.getAnchorKey())
		if (block.type === 'atomic') {
			// console.log("Return Pressed on Atomic");
			return 'handled'
		}
		return 'not-handled'
	}

	render() {
		return (
			<div className="storyWrapper">
				<div
					className="storyEditor"
					style={{
						width: DRAFT_WIDTH
					}}
					onClick={this.onClick}>
					<Editor
						editorState={this.state.editorState}
						onChange={this.onChange}
						placeholder={PLACEHOLDERTEXT}
						blockStyleFn={this.myBlockStyleFn}
						blockRendererFn={this.myBlockRenderer}
						handleReturn={this.handleReturn}
						handleKeyCommand={this.handleKeyCommand}
						keyBindingFn={this.myKeyBindingFn}
						ref={(element) => {
							this.editor = element
						}}/> {/* <EmojiSuggestions/> */}

				</div>
				<div className="sidebarWrapper">
					<EmojiInsert onEmojiClick={this.addEmoji}/>
					<ImageInsert uploadFile={this.uploadFile}/>
					<VideoInsert addVideoBlock={this.addVideoBlock}/>
					<TitleInsert
						editTitle={this.state.titleOpen}
						titleEntityKeyOnEdit={this.state.titleEntityKeyOnEdit}
						currentTitle={this.state.currentTitle}
						updateSubTitle={this.updateSubTitle}
						closeSubTitleEditor={this.closeSubTitleEditor}
						addSubTitleBlock={this.addSubTitleBlock}/>
					<SubTitleList subTitleList={this.state.subTitleList}/>
				</div>
				<SequenceAdjustor
					onSequenceChanged={this.onSequenceChanged}
					contentState={this.state.editorState.getCurrentContent()}
					images={this.props.startingImages}/>
				<ScrollTools/>
			</div>

		)
	}

}

const getSubTitleList = (contentState) => {

	let subTitleBlocks = contentState.getBlockMap().filter((block) => {
		return (block.getType() === 'atomic') && (
			block.getData().toObject().type === 'subTitle'
		)
	})
	let subTitleList = subTitleBlocks.map((block, key) => {
		// console.log(key); console.log(block);
		return block.getData().toObject().title
	})
	return subTitleList
}

MyEditor.propTypes = {
	updateContent: PropTypes.func.isRequired,
	updateCover: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	startingContent: PropTypes.object,
	startingImages: PropTypes.array.isRequired
}

export default compose(WithUpdateContentMutation, WithUpdateCoverMuation)(
	MyEditor
)
