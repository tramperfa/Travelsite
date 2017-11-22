import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
//import imageTest from '../images/testV.jpg';
import ImageCrop from './ImageCrop';
import Button from 'material-ui/Button';

class HeadlineImage extends Component {

  state = {
    cropBox: {}
  }

  updateCropBox = (x, y, width, height) => {
    this.setState({
      cropBox: {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.max(Math.round(width), 900),
        height: Math.max(Math.round(height), 300)
      }
    })

    console.log('To Be Displayed Inside Image Croping Area:   ', this.state.cropBox.width + ' X ' + this.state.cropBox.height);
  }

  handleCrop = async() => {
    let {x, y, width, height} = this.state.cropBox
    await this.props.cropImage("5a13704edaa76a00297c42c6", x, y, width, height)
  }

  render() {
    return (
      <div>
        <ImageCrop updateCropBox={this.updateCropBox} minCropWidthOnCanvas={150} src='https://s3.amazonaws.com/thetripbeyond/origV1-5f47f6b6-88de-4d14-bb3c-b8acacd37428.jpg'/>
        <div>
          <Button raised color="primary" onClick={this.handleCrop}>
            Submit
          </Button>
          <Button raised color="primary">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

}

HeadlineImage.propTypes = {
  cropImage: PropTypes.func.isRequired

}

export const CropImageMutation = gql `
mutation cropImage($input: cropImageInput!) {
  cropImage(input: $input) {
      _id
      draft
      uploadAt
      takenTime
      originalImage {
        filename
        size {
          width
          height
        }
      }
      # browserHeadlineImage
      # browserStoryImage
      # browserCommentImage
      # browserCoverImage
      # browserUserHomeCoverImage

    }
  }
`;

export const WithCropImageMutation = graphql(CropImageMutation, {
  props: ({mutate}) => ({
    cropImage: (imageID, x, y, width, heigth) => mutate({
      variables: {
        input: {
          imageID: imageID,
          x: x,
          y: y,
          width: width,
          height: heigth
        }
      }
    })
  })
})

export default WithCropImageMutation(HeadlineImage)
