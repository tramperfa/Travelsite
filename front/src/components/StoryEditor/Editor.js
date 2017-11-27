import React, {Component} from 'react';
// import { Map } from 'immutable';
import {EditorState, AtomicBlockUtils, convertFromRaw, convertToRaw, DefaultDraftBlockRenderMap} from 'draft-js';
import debounce from 'lodash/debounce';
import Editor from 'draft-js-plugins-editor';
// import Editor, {createEditorStateWithText, composeDecorators} from
// 'draft-js-plugins-editor'; import createEmojiPlugin from
// 'draft-js-emoji-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import styled from 'styled-components'
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
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

// const emojiPlugin = createEmojiPlugin(); const {EmojiSuggestions,
// EmojiSelect} = emojiPlugin;
const videoPlugin = createVideoPlugin();
// const plugins = [emojiPlugin, videoPlugin]
const plugins = [videoPlugin]
const {types} = videoPlugin;

// const initialState = {   "entityMap": {     "0": {       "type": "emoji",
// "mutability": "IMMUTABLE",       "data": {         "emojiUnicode": "🎊"
// }     },     "1": {       "type": "image",       "mutability": "IMMUTABLE",
// "data": {         "src":
// "https://s3.amazonaws.com/thetripbeyond/storyV1-e62c479d-9eb1-4622-a75e-dc4af6ec25ba.jpg"
// }     },     "2": {       "type": types.VIDEOTYPE,       "mutability":
// "IMMUTABLE",       "data": {         "src":
// "https://www.youtube.com/watch?v=9I7H2qspqo8"       }     }   },   "blocks":
// [     {       "key": "9gm3s",       "text": "Hello World! 🎊 ",       "type":
// "unstyled",       "depth": 0,       "inlineStyleRanges": [],
// "entityRanges": [         {           "offset": 13,           "length": 1,
// "key": 0         }       ],       "data": {}     }, {       "key": "ov7r",
// "text": " ",       "type": "atomic",       "depth": 0,
// "inlineStyleRanges": [],       "entityRanges": [         {
// "offset": 0,           "length": 1,           "key": 1         }       ],
// "data": {}     }, {       "key": "e23a8",       "text": "......",
// "type": "unstyled",       "depth": 0,       "inlineStyleRanges": [],
// "entityRanges": [],       "data": {}     }, {       "key": "ov8r",
// "text": " ",       "type": "atomic",       "depth": 0,
// "inlineStyleRanges": [],       "entityRanges": [         {
// "offset": 0,           "length": 1,           "key": 2         }       ],
// "data": {}     }, {       "key": "e23a9",       "text": "......",
// "type": "unstyled",       "depth": 0,       "inlineStyleRanges": [],
// "entityRanges": [],       "data": {}     }   ] }; const blockRenderMap =
// Map({   'unstyled': {     element: 'h3'   } }); const extendedBlockRenderMap
// = DefaultDraftBlockRenderMap.merge(blockRenderMap)
const extendedBlockRenderMap = DefaultDraftBlockRenderMap

const PLACEHOLDERTEXT = "Your story starts here"
const IMAGEPATH = "https://s3.amazonaws.com/thetripbeyond/"
/*
var containerStyle = {
  height: 200
};
*/

class MyEditor extends Component {

	state = {
		draftID: this.props.match.params._id,
		editorState: this.props.startingContent
			? EditorState.createWithContent(convertFromRaw(this.props.startingContent))
			: EditorState.createEmpty(),
		uploading: false
	}

	// EditorState.createWithContent(convertFromRaw(initialState))
	// createEditorStateWithText(initialText) EditorState.createEmpty()

	onChange = (editorState) => {
		// console.log(editorState.getSelection())
		const currentContent = this.state.editorState.getCurrentContent()
		const newContent = editorState.getCurrentContent()
		if (currentContent !== newContent) {
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
			this.state.draftID,
			localImageSize.width,
			localImageSize.height
		)
		const imageID = uploadedImage._id
		const imageFileName = uploadedImage.browserStoryImage.filename
		const imageURL = IMAGEPATH + imageFileName

		let newState = this.addAtomicBlock(origEditorState, 'image', {
			id: imageID,
			src: imageURL
		})
		this.onChange(newState)
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
		return newEditorState
	}

	// addImageBlock = (editorState, url) => {   const urlType = 'image';   const
	// contentState = editorState.getCurrentContent();   const
	// contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE',
	// {src: url});   const entityKey =
	// contentStateWithEntity.getLastCreatedEntityKey();    console.log(entityKey)
	// const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState,
	// entityKey, ' ');   return newEditorState } addImagePlaceHolder =
	// (editorState, url) => {   const urlType = 'imagePlaceHolder';   const
	// contentState = editorState.getCurrentContent();   const
	// contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE',
	// {src: url});   const entityKey =
	// contentStateWithEntity.getLastCreatedEntityKey();    console.log(entityKey)
	// const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState,
	// entityKey, ' ');   return newEditorState } uploadImageAsync(file) {   return
	// new Promise((resolve, reject) => {     setTimeout(() => {        const src =
	// window.URL.createObjectURL(file)        resolve( {src: src} )       resolve()
	// }, 3000)   }) }

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
		const editorState = this.state.editorState;
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(
			'subTitle',
			'IMMUTABLE',
			{src: text}
		)
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
		this.onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ''));
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
					component: TitleBlock, editable: false,
					// props: {   text: contentBlock.getText() }
				}
			} else if (entityType === 'image') {
				return {component: ImageBlock, editable: false}
			} else if (entityType === 'imagePlaceHolder') {
				return {component: ImagePlaceHolder, editable: false}
			}
		}
		return null
	}

	render() {
		return (
			<StoryEditorWrapper>
				{/* <StoryEditor onClick={this.focus}> */}
				<StoryEditor >
					<Editor
						editorState={this.state.editorState}
						onChange={this.onChange}
						placeholder={PLACEHOLDERTEXT}
						plugins={plugins}
						blockRenderMap={extendedBlockRenderMap}
						blockStyleFn={this.myBlockStyleFn}
						blockRendererFn={this.myBlockRenderer}
						ref={(element) => {
							this.editor = element
						}}/> {/* <EmojiSuggestions/> */}

				</StoryEditor>
				{/* {this.state.uploading && <ImagePlaceHolder/>} */}
				<ToolsWrapper>
					{/* <EmojiSelect/> */}
					<ImageInsert uploadFile={this.uploadFile}/>
					<VideoInsert addVideoBlock={this.addVideoBlock}/>
					<TitleInsert addSubTitleBlock={this.addSubTitleBlock}/> {/* <SubTitleList/> */}
				</ToolsWrapper>
			</StoryEditorWrapper>

		)
	}
}

MyEditor.PropTypes = {
	updateContent: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	startingContent: PropTypes.object.isRequired
}

export const UpdateContentMutation = gql `
mutation updateContent($input: updateContentInput!) {
  updateContent(input: $input) {
      _id
      content
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
/*
const Dummy = styled.div `
  height: 600px;
  background-color: #c2f0c2
`
*/
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
