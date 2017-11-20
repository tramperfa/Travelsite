import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import ImageUpload from './ImageUpload';

//import {CircularProgress} from 'material-ui/Progress';

class HeadlineUpload extends React.Component {

  onDrop = async(files) => {
    const draftID = this.props.match.params._id
    ImageUpload(files[0], 0, draftID)
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop} accept="image/jpeg, image/gif, image/png">
          <div>Try dropping a file here, or click to select a file to upload.</div>
        </Dropzone>
      </div>
    );
  }
}

HeadlineUpload.propTypes = {
  match: PropTypes.object.isRequired
}

export default HeadlineUpload

// }).then(() => {
//   console.log("UPLOAD FINISH");
// }).catch((error) => {
//   console.log('there was an error during fileupload', error);
// })

// .on('progress', event => {
// console.log('Percentage done: ', event.percent);
// console.log('Total File Size: ', event.total);
// /* the event is:
//   {
//     direction: "upload" or "download"
//     percent: 0 to 100 // may be missing if file size is unknown
//     total: // total file size, may be missing
//     loaded: // bytes downloaded or uploaded so far
//   } */
// })
