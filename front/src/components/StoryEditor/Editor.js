import React, {Component} from 'react';
import {List} from 'immutable'
import {
	Editor,
	EditorState,
	ContentState,
	SelectionState,
	AtomicBlockUtils,
	convertFromRaw,
	convertToRaw,
	getDefaultKeyBinding,
	Modifier,
	ContentBlock,
	genKey
} from 'draft-js';
import debounce from 'lodash/debounce';
// import Editor from 'draft-js-plugins-editor' {createEditorStateWithText,
// composeDecorators} from 'draft-js-plugins-editor'; import createEmojiPlugin
// from 'draft-js-emoji-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo'
import equal from 'fast-deep-equal'

// import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css'
import './BlockStyles.css'

import willUploadImage from '../../lib/ImageUpload'
import willExtractOrientation from './util/ExtractOrientation'
import willExtractSize from './util/ExtractSize'
import client from '../../graphql/graphql';
import {DRAFT_IMAGE_ARRAY_QUERY} from '../../graphql/draft';
import {UPDATE_CONTENT_MUTATION} from '../../graphql/draft';

import TitleBlock from './TitleBlock';
import ImageInsert from './ImageInsert';
import ImageBlock from './ImageBlock'
import VideoInsert from './VideoInsert'
import TitleInsert from './TitleInsert'
import SubTitleList from './SubTitleList'

import CONFIG from '../../lib/config'
import searchImage from '../../lib/searchImage'

// const emojiPlugin = createEmojiPlugin(); const {EmojiSuggestions,
// EmojiSelect} = emojiPlugin;
const videoPlugin = createVideoPlugin();
// const plugins = [emojiPlugin, videoPlugin]
const plugins = [videoPlugin]
const {types} = videoPlugin;

const PLACEHOLDERTEXT = "Your story starts here"
const BUCKET_NAME = CONFIG.BUCKET_NAME
const DRAFT_WIDTH = CONFIG.DRAFT_WIDTH

class MyEditor extends Component {

	state = {
		editorState: this.props.startingContent
			? EditorState.createWithContent(convertFromRaw(this.props.startingContent))
			: EditorState.createEmpty(),
		images: this.props.startingImages
			? this.props.startingImages
			: undefined,
		subTitleList: this.props.startingContent
			? getSubTitleList(convertFromRaw(this.props.startingContent))
			: undefined,
		titleOpen: false,
		titleBlockKeyOnEdit: '',
		titleEntityKeyOnEdit: '',
		currentTitle: ''
	}
	// EditorState.createWithContent(convertFromRaw(initialState))
	// createEditorStateWithText(initialText) EditorState.createEmpty()

	onClick = () => {
		this.editor.focus()
	}

	onChange = (editorState) => {
		// console.log(this.state.editorState.getSelection());
		const currentContent = this.state.editorState.getCurrentContent()
		const newContent = editorState.getCurrentContent()
		if (!equal(currentContent, newContent)) {
			this.saveContent(newContent)
		}
		this.setState({editorState: editorState})
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

		let editorStateWithPlaceholder = this.addAtomicBlock('image', {
			width: localImageSize.width > DRAFT_WIDTH
				? DRAFT_WIDTH
				: localImageSize.width,
			height: localImageSize.width > DRAFT_WIDTH
				? localImageSize.height / localImageSize.width * DRAFT_WIDTH
				: localImageSize.height
		})
		// console.log(convertToRaw(editorStateWithPlaceholder.getCurrentContent()));
		this.setState({editorState: editorStateWithPlaceholder})
		const contentStateWithPlaceHolder = editorStateWithPlaceholder.getCurrentContent()
		const recentEntityKey = contentStateWithPlaceHolder.getLastCreatedEntityKey()
		// console.log(convertToRaw(tempState.getCurrentContent()));
		// console.log(recentEntityKey);

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
		const imageID = uploadedImage._id
		const contentStateWithRemoteImage = contentStateWithPlaceHolder.replaceEntityData(
			recentEntityKey,
			{_id: imageID}
		)

		// force rerender can be removed when draft update to v0.11. automatically
		// re-render after replaceEntityData
		this.setState({
			editorState: EditorState.forceSelection(
				this.state.editorState,
				this.state.editorState.getSelection()
			)
		})

		this.saveContent(contentStateWithRemoteImage)
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

	addAtomicBlock = (entityType, data) => {
		const editorState = this.state.editorState
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(
			entityType,
			'IMMUTABLE',
			data
		);
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		// console.log(entityKey)
		const newEditorState = AtomicBlockUtils.insertAtomicBlock(
			editorState,
			entityKey,
			' '
		);
		if (entityType !== 'image') {
			this.onChange(newEditorState)
		}
		return newEditorState
	}

	addVideoBlock = (url) => {
		// console.log(url)
		const editorState = this.state.editorState;
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(
			types.VIDEOTYPE,
			'IMMUTABLE',
			{src: url}
		);
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		this.onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '));
	}

	addSubTitleBlock = (text) => {
		let newEditorState = this.addAtomicBlock('subTitle', {title: text})
		this.setState({
			subTitleList: getSubTitleList(newEditorState.getCurrentContent())
		})
	}

	openSubTitleEditor = (titleBlockKeyOnEdit, titleEntityKeyOnEdit, currentTitle) => {
		this.setState(
			{titleOpen: true, titleBlockKeyOnEdit: titleBlockKeyOnEdit, titleEntityKeyOnEdit: titleEntityKeyOnEdit, currentTitle: currentTitle}
		)
	}

	closeSubTitleEditor = () => {
		this.setState({titleOpen: false})
	}

	updateSubTitle = (newTitle) => {
		let origES = this.state.editorState
		const contentState = origES.getCurrentContent()
		const newContentState = contentState.replaceEntityData(
			this.state.titleEntityKeyOnEdit,
			{title: newTitle}
		)
		const newTitleList = this.state.subTitleList.update(
			this.state.titleBlockKeyOnEdit,
			value => newTitle
		)
		this.setState({subTitleList: newTitleList})
		this.editor.focus()
		this.saveContent(newContentState)
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

	deleteAtomicBlock = (blockKey) => {
		const editorState = this.state.editorState
		const contentState = editorState.getCurrentContent()
		const blockKeyBefore = contentState.getKeyBefore(blockKey)
		const blockKeyAfter = contentState.getKeyAfter(blockKey)
		const selectionState = editorState.getSelection()

		// Start Updating Content State
		const selectAtomic = selectionState.merge({
			anchorKey: blockKeyBefore, anchorOffset: contentState.getBlockForKey(blockKeyBefore).getLength(),
			//
			focusKey: blockKey,
			focusOffset: contentState.getBlockForKey(blockKey).getLength()
		})
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
			// console.log("A subtitle")
			const entity = contentBlock.getEntityAt(0);
			if (!entity) {
				return null
			}
			const contentState = this.state.editorState.getCurrentContent()
			const entityType = contentState.getEntity(entity).getType()
			if (entityType === 'subTitle') {
				return {
					component: TitleBlock,
					editable: false,
					props: {
						openSubTitleEditor: this.openSubTitleEditor,
						deleteBlock: this.deleteSubTitle
					}
				}
			} else if (entityType === 'image') {
				const entityData = contentState.getEntity(entity).getData()
				if (entityData._id) {
					const imageData = searchImage(entityData._id, this.props.startingImages)
					return {
						component: ImageBlock,
						editable: false,
						props: {
							src: BUCKET_NAME + imageData.browserStoryImage.filename,
							width: imageData.browserStoryImage.size.width,
							height: imageData.browserStoryImage.size.height,
							deleteBlock: this.deleteAtomicBlock
						}
					}
				} else {
					return {
						component: ImageBlock,
						editable: false,
						props: {
							width: entityData.width,
							height: entityData.height
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
						plugins={plugins}
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
					{/* <EmojiSelect/> */}
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
			contentState.getEntity(block.getEntityAt(0)).getType() === 'subTitle'
		)
	})
	let subTitleList = subTitleBlocks.map((block, key) => {
		// console.log(key); console.log(block);
		return contentState.getEntity(block.getEntityAt(0)).getData().title
	})
	// console.log(subTitleList);
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
