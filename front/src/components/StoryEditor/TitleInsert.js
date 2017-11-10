import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'

import {EditorState, Modifier} from 'draft-js'

import IconButton from 'material-ui/IconButton';
import Title from 'material-ui-icons/Title'
import Input from 'material-ui/Input';

const {Map} = Immutable
const HINTTEXT = "Type a subtitle and press 'Enter'"

export default class extends Component {

  state = {
    active: false,
    title: ""
  }

  onClick = () => {
    // ReactDOM.findDOMNode(this.refs.fileInput).click()
    this.setState({active: true})
  }

  onBlur = () => {
    // console.log("onBlur")
    this.setState({active: false})
  }

  onChange = (e) => {
    // console.log(e.target.value)
    this.setState({title: e.target.value})
  }

  onKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.onBlur()
      // const title = {text: this.state.title, type: 'code-block'}
      const title = this.state.title
      // console.log(title)
      const editorState = this.props.editorState
      const contentState = editorState.getCurrentContent()
      const selectionState = editorState.getSelection()
      const anchorKey = selectionState.getAnchorKey()
      const currentContentBlock = contentState.getBlockForKey(anchorKey)
      // const currentBlockData = currentContentBlock.getText()
      // console.log(currentBlockData)
      // console.log(currentBlockData.merge(new Map(title)))
      // const newContent = Modifier.setBlockData(contentState, selectionState, currentBlockData.merge(new Map(title)))
      let newContent = Modifier.setBlockType(contentState, selectionState, 'code-block')
      newContent = Modifier.insertText(newContent, selectionState, title)
      // console.log(newContent.getBlockForKey(anchorKey).getData())
      const newEditorState = EditorState.push(editorState, newContent, 'insert-fragment')
      this.props.onChange(newEditorState)
    }
  }

  render () {
    return (
      <div>
        <IconButton onClick={this.onClick}>
          <Title/>
        </IconButton>

        {this.state.active &&
          <Input
            autoFocus = {true}
            onBlur = {this.onBlur}
            placeholder = {HINTTEXT}
            onChange = {this.onChange}
            onKeyPress = {this.onKeyPress}
            style = {{width: 400, position: "relative", left: -500}}
           />
        }
      </div>

    )
  }
}
