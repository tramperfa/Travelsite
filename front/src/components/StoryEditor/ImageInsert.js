import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import IconButton from 'material-ui/IconButton';
import AddAPhoto from 'material-ui-icons/AddAPhoto';
//import Icon from 'material-ui/Icon';

export default class extends Component {

  onClick = () => {
    ReactDOM.findDOMNode(this.refs.fileInput).click()
    // console.log("Add a image click")
  }
  inputChange = (e) => {
    const file = e.target.files[0]
    // console.log(e.target.files);
    this.props.uploadFile(file)
  }

  render() {
    return (
      <div>
        <IconButton onClick={this.onClick}>
          <AddAPhoto/>
        </IconButton>
        <input type='file' ref='fileInput' onChange={this.inputChange} accept="image/*"
        style={{
          display: 'none'
        }}/>
      </div>

    )
  }
}
