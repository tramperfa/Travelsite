import React from 'react';
import Dropzone from 'react-dropzone';
import upload from 'superagent';
//import superagent from 'superagent';

class FileUpload extends React.Component {

  onDrop = (files) => {
    upload.post('http://localhost:8080/upload').attach('theseNamesMustMatch', files[0]).end((err, res) => {
      if (err)
        console.log(err);
      else {
        alert('File uploaded!');
      }
    })
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop}>
          <div>Try dropping a file here, or click to select a file to upload.</div>
        </Dropzone>
      </div>
    );
  }
}

export default FileUpload;
