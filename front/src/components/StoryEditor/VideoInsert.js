import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import IconButton from 'material-ui/IconButton';
import VideoCall from 'material-ui-icons/VideoCall';
import Icon from 'material-ui/Icon';
import Input from 'material-ui/Input';

const HINTTEXT = "Paste/Type a youtube video url and press 'Enter'"
const re = /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i
export default class extends Component {

  state = {
    url: "",
    active: false
  }

  onClick = () => {
    // ReactDOM.findDOMNode(this.refs.fileInput).click()
    // console.log("Add a video click")
    this.setState({active: true})
  }

  onBlur = () => {
    // console.log("onBlur")
    this.setState({active: false})
  }

  onChange = (e) => {
    // console.log(e.target.value)
    this.setState({url: e.target.value})
  }

  onKeyPress = (e) => {
    if(e.key === 'Enter') {
      // console.log(this.state.url)
      this.onBlur()
      const url = this.state.url
      const matches = re.exec(url)
      if (matches && matches[1]) {
        this.props.addVideoBlock(`https://youtube.com/embed/${matches[1]}`)
      } else {
        console.log("Please type a valid youtube video link")
      }
    }
  }

  render () {
    return (
      <div>
        <IconButton onClick={this.onClick}>
          <VideoCall/>
        </IconButton>

        {this.state.active &&
          <Input
            autoFocus = {true}
            onBlur = {this.onBlur}
            placeholder = {HINTTEXT}
            onChange = {this.onChange}
            onKeyPress = {this.onKeyPress}
            style = {{width: 500}}
           />
        }
      </div>

    )
  }
}
