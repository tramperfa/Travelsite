import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';

import ImageUpload from './ImageUpload';

//import {CircularProgress} from 'material-ui/Progress';

class HeadlineUpload extends React.Component {

  onDrop = async(files) => {
    const storyID = this.props.match.params._id
    ImageUpload(files[0], 0, storyID)
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
  addStoryImage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

export const CreateImageMutation = gql `
mutation addStoryImage($input: addStoryImageInput!) {
  addStoryImage(input: $input) {
      _id
      catergory
    }
  }
`;

export const WithCreateImageMuation = graphql(CreateImageMutation, {
  props: ({mutate}) => ({
    addStoryImage: (catergory, storyID) => mutate({
      variables: {
        input: {
          catergory: catergory,
          storyID: storyID
        }
      }
    })
  })
})

export default WithCreateImageMuation(HeadlineUpload)

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
