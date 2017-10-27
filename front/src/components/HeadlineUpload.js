import React from 'react';
import Dropzone from 'react-dropzone';
import upload from 'superagent';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';

//import {CircularProgress} from 'material-ui/Progress';

class HeadlineUpload extends React.Component {

  state = {}

  onDrop = async(files) => {
    const storyID = this.props.match.params._id
    const extension = files[0].name.split('.').pop();

    //console.log("AHA" + JSON.stringify(files[0]))
    const data = await this.props.createImage(0, storyID)
    upload.post('http://localhost:8080/upload').attach('image', files[0], data.data.createImage._id + '.' + extension)
    //
      .field('imageID', data.data.createImage._id).field('catergory', 0).field('extension', extension)
    //
      .end((err, res) => {
      if (err)
        console.log(err);
      alert('File uploaded!');
    })
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
  createImage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

export const CreateImageMutation = gql `
mutation createImage($input: createImageInput!) {
  createImage(input: $input) {
      _id
      catergory
    }
  }
`;

export const WithCreateImageMuation = graphql(CreateImageMutation, {
  props: ({mutate}) => ({
    createImage: (catergory, storyID) => mutate({
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
