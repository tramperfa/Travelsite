import React, {Component} from 'react';
import {List} from 'immutable'
import {
	Editor,
	EditorState,
	ContentState,
	SelectionState,
	convertFromRaw,
	convertToRaw,
	getDefaultKeyBinding,
	Modifier,
	ContentBlock,
	genKey
} from 'draft-js';
import debounce from 'lodash/debounce';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo'
import equal from 'fast-deep-equal'

import 'draft-js/dist/Draft.css'
import './BlockStyles.css'

import willUploadImage from '../../lib/ImageUpload'
import willExtractOrientation from './util/ExtractOrientation'
import willExtractSize from './util/ExtractSize'
import insertAtomicBlock from './util/insertAtomicBlock'
import client from '../../graphql/graphql';
import {DRAFT_IMAGE_ARRAY_QUERY} from '../../graphql/draft';
import {UPDATE_CONTENT_MUTATION} from '../../graphql/draft';

import EmojiInsert from './EmojiInsert'
import ImageInsert from './ImageInsert';
import VideoInsert from './VideoInsert'
import TitleInsert from './TitleInsert'
import SubTitleList from './SubTitleList'
import Atomic from './Atomic'
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
					EditorState.createWithContent(convertFromRaw(this.props.startingContent)),
					{allowUndo: false}
				)
				: EditorState.set(EditorState.createEmpty(), {allowUndo: false}),
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

		const editorState = this.state.editorState
		const newEditorState = insertAtomicBlock(editorState, {
			"type": "image",
			"_id": uploadedImage._id
		})
		this.onChange(newEditorState)
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

	anotherDeleteAtomicBlock = (blockKey) => {
		const contentState = this.state.editorState.getCurrentContent()
		const selectionState = this.state.editorState.getSelection()
		const blockKeyAfter = contentState.getKeyAfter(blockKey)

		const blockMap = contentState.getBlockMap().delete(blockKey)
		const contentStateAfterRemoval = contentState.merge(
			{blockMap, selectionAfter: selectionState}
		)

		const newState = EditorState.push(
			this.state.editorState,
			contentStateAfterRemoval,
			'remove-range'
		)

		const newSelection = new SelectionState(
			{anchorKey: blockKeyAfter, anchorOffset: 0, focusKey: blockKeyAfter, focusOffset: 0}
		)

		const newEditorState = EditorState.forceSelection(newState, newSelection)
		this.onChange(newEditorState)
	}

	deleteAtomicBlockV3 = (blockKey) => {
		const contentState = this.state.editorState.getCurrentContent()

		//create empty block
		const newBlock = new ContentBlock(
			{key: genKey(), type: "unstyled", text: "", characterList: List()}
		)

		const blockMap = contentState.getBlockMap().set(newBlock.key, newBlock)
		const newState = EditorState.push(
			this.state.editorState,
			ContentState.createFromBlockArray(blockMap.toArray()).set('selectionBefore', contentState.getSelectionBefore()).set('selectionAfter', contentState.getSelectionAfter())
		)
		/*
		const blockMap = contentState.getBlockMap().delete(blockKey)
		const contentStateAfterRemoval = contentState.merge(
			{blockMap, selectionAfter: selectionState}
		)

		const newState = EditorState.push(
			this.state.editorState,
			contentStateAfterRemoval,
			'remove-range'
		)
*/

		this.onChange(newState)
	}

	deleteAtomicBlockV2 = (blockKey) => {
		console.log("deleteAtomicBlockV2 Called");
		const editorState = this.state.editorState
		const selection = editorState.getSelection()
		const content = editorState.getCurrentContent()
		const keyAfter = content.getKeyAfter(blockKey);
		const blockMap = content.getBlockMap().delete(blockKey);
		const withoutAtomicBlock = content.merge({blockMap, selectionAfter: selection});
		const newState = EditorState.push(
			editorState,
			withoutAtomicBlock,
			"remove-range"
		);
		const newSelection = new SelectionState(
			{anchorKey: keyAfter, anchorOffset: 0, focusKey: keyAfter, focusOffset: content.getBlockForKey(blockKey).getLength()}
		);
		const newEditorState = EditorState.forceSelection(newState, newSelection);
		this.onChange(newEditorState)
	}

	deleteAtomicBlock = (blockKey) => {
		const editorState = this.state.editorState
		const contentState = editorState.getCurrentContent()
		const blockKeyBefore = contentState.getKeyBefore(blockKey)
		const blockKeyAfter = contentState.getKeyAfter(blockKey)
		const selectionState = editorState.getSelection()

		// Start Updating Content State
		const selectAtomic = selectionState.merge(
			{anchorKey: blockKeyBefore, anchorOffset: contentState.getBlockForKey(blockKeyBefore).getLength(), focusKey: blockKey, focusOffset: contentState.getBlockForKey(blockKey).getLength()}
		)
		const contentStateAfterRemoval = Modifier.removeRange(
			contentState,
			selectAtomic,
			'forward'
		)
		const selectAfter = selectAtomic.merge(
			{anchorKey: blockKeyAfter, anchorOffset: 0, focusKey: blockKeyAfter, focusOffset: 0}
		)
		const contentWithSeletAfter = contentStateAfterRemoval.merge(
			{selectionAfter: selectAfter}
		)
		const newState = EditorState.push(
			this.state.editorState,
			contentWithSeletAfter,
			'remove-range'
		)
		this.onChange(newState)
	}

	deleteSubTitle = (blockKey) => {
		this.deleteAtomicBlock(blockKey)
		const newList = this.state.subTitleList.delete(blockKey)
		this.setState({subTitleList: newList})
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
							height: imageData.browserStoryImage.size.height
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
			<StoryEditorWrapper>
				<StoryEditor onClick={this.onClick}>
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

				</StoryEditor>
				<ToolsWrapper>
					<EmojiInsert/>
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
				</ToolsWrapper>
			</StoryEditorWrapper>

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
	match: PropTypes.object.isRequired,
	startingContent: PropTypes.object,
	startingImages: PropTypes.array.isRequired
}

export const WithContentMuation = graphql(UPDATE_CONTENT_MUTATION, {
	props: ({mutate}) => ({
		updateContent: (draftID, newContent) => mutate({
			variables: {
				input: {
					draftID: draftID,
					newContent: newContent
				}
			}
		})
	})
})

export default WithContentMuation(MyEditor)

const StoryEditorWrapper = styled.div `
  display: flex;
  flex-direction: row;
`

const StoryEditor = styled.div `
  cursor: text;
  text-align: left;
  margin-left: 80px;
  margin-right: 80px;
  padding-top: 16px;
  padding-bottom: 16px;
  min-width: 700px;
  max-width: 700px
`

const ToolsWrapper = styled.div `
  padding: 16px;
  height: fit-content;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: sticky;
  top: 0px;
  z-index: 10
`
