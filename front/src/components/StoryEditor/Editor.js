import React, {Component} from 'react';
import client from '../../graphql/graphql';
// import { Map } from 'immutable';
import {EditorState, AtomicBlockUtils, convertFromRaw, convertToRaw, getDefaultKeyBinding} from 'draft-js';
import debounce from 'lodash/debounce';
import Editor from 'draft-js-plugins-editor';
// import Editor, {createEditorStateWithText, composeDecorators} from
// 'draft-js-plugins-editor'; import createEmojiPlugin from
// 'draft-js-emoji-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
// import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css'

import TitleBlock from './TitleBlock';
import ImageInsert from './ImageInsert';
import willUploadImage from '../../lib/ImageUpload'

import ImagePlaceHolder from './ImagePlaceHolder';
import ImageBlock from './ImageBlock'
import VideoInsert from './VideoInsert'
import TitleInsert from './TitleInsert'
// import SubTitleList from './SubTitleList'

import './BlockStyles.css'

import willExtractOrientation from './util/ExtractOrientation'
import willExtractSize from './util/ExtractSize'

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
/*
var containerStyle = {
  height: 200
};
*/

const imageArrayQuery = gql `
query DraftQuery($draftID : ID!) {
  draft(draftID: $draftID) {
    _id
    images{
      _id
      browserStoryImage{
        filename
        size{
          width
          height
        }
      }
    }
  }
}
`;

class MyEditor extends Component {

	state = {
		editorState: this.props.startingDraft.content
			? EditorState.createWithContent(
				convertFromRaw(this.props.startingDraft.content)
			)
			: EditorState.createEmpty(),
		titleOpen: false,
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
		if (currentContent !== newContent) {
			console.log("On Change")
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

		const origEditorState = this.state.editorState

		// example localImageData {orientation: 8, src: <localURL>}
		let localImageData = await willExtractOrientation(file)
		// example localImageSize {width: 100, height: 100}
		let localImageSize = await willExtractSize(localImageData)

		// const recentEntityKey =
		// tempState.getCurrentContent().getLastCreatedEntityKey()
		// console.log(convertToRaw(tempState.getCurrentContent()));
		// console.log(recentEntityKey);

		const uploadedImage = await willUploadImage(
			file,
			0,
			this.props.match.params._id,
			localImageSize.width,
			localImageSize.height
		)
		const imageID = uploadedImage._id
		// const imageFileName = uploadedImage.browserStoryImage.filename const imageURL
		// = BUCKET_NAME + imageFileName const imageWidth =
		// uploadedImage.browserStoryImage.size.width const imageHeight =
		// uploadedImage.browserStoryImage.size.height

		this.addAtomicBlock(origEditorState, 'image', {id: imageID})
	}

	addAtomicBlock = (editorState, entityType, data) => {
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
		this.onChange(newEditorState)
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
		this.addAtomicBlock(this.state.editorState, 'subTitle', {title: text})
	}

	openSubTitleEditor = (titleEntityKeyOnEdit, currentTitle) => {
		this.setState(
			{titleOpen: true, titleEntityKeyOnEdit: titleEntityKeyOnEdit, currentTitle: currentTitle}
		)
	}

	closeSubTitleEditor = () => {
		this.setState({titleOpen: false})
	}

	updateSubTitle = (entityKey, newTitle) => {
		let origES = this.state.editorState
		const contentState = origES.getCurrentContent()
		const newContentState = contentState.replaceEntityData(
			entityKey,
			{title: newTitle}
		)
		this.editor.focus()
		this.saveContent(newContentState)
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
						openSubTitleEditor: this.openSubTitleEditor
					}
				}
			} else if (entityType === 'image') {
				const entityData = contentState.getEntity(entity).getData()
				const imageData = searchImage(entityData._id, this.props.startingDraft.images)
				return {
					component: ImageBlock,
					editable: false,
					props: {
						src: BUCKET_NAME + imageData.browserStoryImage.filename,
						width: imageData.browserStoryImage.size.width,
						height: imageData.browserStoryImage.size.height
					}
				}
			} else if (entityType === 'imagePlaceHolder') {
				return {component: ImagePlaceHolder, editable: false}
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
			if (block.type === 'atomic') {
				// console.log("Delete Pressed on Atomic")
				return 'do-nothing'
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
						addSubTitleBlock={this.addSubTitleBlock}/> {/* <SubTitleList/> */}
				</ToolsWrapper>
			</StoryEditorWrapper>

		)
	}
}

MyEditor.propTypes = {
	updateContent: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	startingContent: PropTypes.object,
	startingImages: PropTypes.array.isRequired
}

export const UpdateContentMutation = gql `
mutation updateContent($input: updateContentInput!) {
  updateContent(input: $input) {
      _id
      lastUpdate
    }
  }
`;

export const WithContentMuation = graphql(UpdateContentMutation, {
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
  ${ ''/* box-sizing: border-box;
  border: 1px solid #ddd; */}
  margin-left: 80px;
  margin-right: 80px;
  padding-top: 16px;
  padding-bottom: 16px;
  ${ ''/* padding: 16px;
  border-radius: 2px;
  margin-bottom: 2em;
  box-shadow: inset 0px 1px 8px -3px #ABABAB;
  background: #fefefe; */}
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
