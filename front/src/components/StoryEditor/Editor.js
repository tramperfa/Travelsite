import React, {Component} from 'react';
import { Map } from 'immutable';
//import { StickyContainer, Sticky } from 'react-sticky';
import {EditorState, AtomicBlockUtils, convertFromRaw, convertToRaw, DefaultDraftBlockRenderMap} from 'draft-js';
import debounce from 'lodash/debounce';
import Editor, {createEditorStateWithText, composeDecorators} from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';

import TitleBlock from './TitleBlock';
import ImageInsert from './ImageInsert';
import ImagePlaceHolder from './ImagePlaceHolder';
import VideoInsert from './VideoInsert'
import TitleInsert from './TitleInsert'
import SubTitleList from './SubTitleList'

import styled from 'styled-components'
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css'

import './BlockStyles.css'

const emojiPlugin = createEmojiPlugin();
const {EmojiSuggestions, EmojiSelect} = emojiPlugin;
const videoPlugin = createVideoPlugin();

const blockDndPlugin = createBlockDndPlugin();
const decorator = composeDecorators(blockDndPlugin.decorator);

const imagePlugin = createImagePlugin({
  theme: {
    image: "image"
  },
  decorator: decorator
});

const plugins = [emojiPlugin, videoPlugin, blockDndPlugin, imagePlugin];

const {types} = videoPlugin;

const initialState = {
  "entityMap": {
    "0": {
      "type": "emoji",
      "mutability": "IMMUTABLE",
      "data": {
        "emojiUnicode": "🎊"
      }
    },
    "1": {
      "type": "image",
      "mutability": "IMMUTABLE",
      "data": {
        "src": "https://s3.amazonaws.com/thetripbeyond/59f092a2e9da3d0414879ce4.jpg"
      }
    },
    "2": {
      "type": types.VIDEOTYPE,
      "mutability": "IMMUTABLE",
      "data": {
        "src": "https://www.youtube.com/watch?v=9I7H2qspqo8"
      }
    }
  },
  "blocks": [
    {
      "key": "9gm3s",
      "text": "Hello World! 🎊 ",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 13,
          "length": 1,
          "key": 0
        }
      ],
      "data": {}
    }, {
      "key": "ov7r",
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 1,
          "key": 1
        }
      ],
      "data": {}
    }, {
      "key": "e23a8",
      "text": "......",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }, {
      "key": "ov8r",
      "text": " ",
      "type": "atomic",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 1,
          "key": 2
        }
      ],
      "data": {}
    }, {
      "key": "e23a9",
      "text": "......",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ]
};

// const blockRenderMap = Map({
//   'unstyled': {
//     element: 'h3'
//   }
// });
// const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap)
const extendedBlockRenderMap = DefaultDraftBlockRenderMap

const placeholderText = "Your story starts here"

var containerStyle = {
  height: 200
};

class MyEditor extends Component {

  state = {
    //editorState: EditorState.createEmpty(),
    editorState: this.props.startingContent
      ? EditorState.createWithContent(convertFromRaw(this.props.startingContent))
      : EditorState.createWithContent(convertFromRaw(initialState)),
    uploading: false
  }

  //EditorState.createWithContent(convertFromRaw(initialState))
  //createEditorStateWithText(initialText)

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

  focus = () => {
    this.editor.focus()
  };

  uploadFile = (file) => {
    if (file.type.indexOf('image/') !== 0) {
      console.log("File type error. Select image file only!")
      return
    }

    const localUrl = window.URL.createObjectURL(file)
    // console.log(this.state.editorState.getSelection())
    let newState = this.addImageBlock(this.state.editorState, localUrl)
    // console.log(newState.getSelection())
    this.onChange(newState)
    this.setState({uploading: true})
    this.uploadImageAsync(file).then((data) => {
      // console.log(data.src)
      // let newState = this.addImageBlock(this.state.editorState, data.src)
      // console.log(convertToRaw(newState.getCurrentContent()))
      // console.log(newState.getSelection())
      // const contentState = this.state.editorState.getCurrentContent();
      // const entityKey = contentState.getLastCreatedEntityKey()
      // const newContent = contentState.replaceEntityData(
      //   entityKey,
      //   {data: {"src": data.src}}
      // )
      // const newState = EditorState.push(this.state.editorState, newContent)
      this.setState({uploading: false})
      console.log("upload finish")
    })

  }

  addImageBlock = (editorState, url) => {
    const urlType = 'image';
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', {src: url});
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    // console.log(entityKey)
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    return newEditorState
  }

  uploadImageAsync(file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // const src = window.URL.createObjectURL(file)
        // resolve( {src: src} )
        resolve()
      }, 3000)
    })
  }

  addVideoBlock = (url) => {
    // console.log(url)
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(types.VIDEOTYPE, 'IMMUTABLE', {src: url});
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    this.onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '));
  }

  myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType()
    if(type === 'atomic') {
      return 'myAtomicStyle'
    }
  }

  myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType()
    if (type === 'code-block') {
      // console.log("A subtitle")
      return {
        component: TitleBlock,
        editable: false,
        props: {
          text: contentBlock.getText()
        }
      }
    }
  }

  render() {
    return (
      <StoryEditorWrapper>
        <StoryEditor onClick={this.focus}>

          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder={placeholderText}
            plugins={plugins}
            blockRenderMap={extendedBlockRenderMap}
            blockStyleFn={this.myBlockStyleFn}
            blockRendererFn={this.myBlockRenderer}
            ref={(element) => {this.editor = element}}
          />
          <EmojiSuggestions/>

        </StoryEditor>
        {this.state.uploading && <ImagePlaceHolder/>}
        <ToolsWrapper>
          <EmojiSelect/>
          <ImageInsert uploadFile={this.uploadFile}/>
          <VideoInsert addVideoBlock={this.addVideoBlock}/>
          <TitleInsert editorState={this.state.editorState} onChange={this.onChange}/>
          <SubTitleList/>
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

const Dummy = styled.div `
  height: 600px;
  background-color: #c2f0c2
`

const StoryEditor = styled.div `
  cursor: text;
  text-align: left;
  box-sizing: border-box;
  border: 1px solid #ddd;
  margin-left: 80px;
  margin-right: 80px;
  padding: 16px;
  border-radius: 2px;
  margin-bottom: 2em;
  box-shadow: inset 0px 1px 8px -3px #ABABAB;
  background: #fefefe;
  min-width: 800px;
  max-width: 800px
`

const ToolsWrapper = styled.div `
  padding: 16px;
  height: fit-content;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: sticky;
  top: 0px
`
