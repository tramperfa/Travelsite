import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

import ImageUpload from './ImageUpload';

//import {CircularProgress} from 'material-ui/Progress';

class HeadlineUpload extends React.Component {

  onDrop = async(files) => {
    const draftID = this.props.match.params._id
    ImageUpload(files[0], 1, draftID)
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
