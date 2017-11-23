import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog';

//
import ImageCrop from './ImageCrop';

class HeadlineImageCrop extends Component {

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

  handleSubmit = async() => {
    try {
      let {x, y, width, height} = this.state.cropBox
      console.log("Cropping At:  ");
      console.log(this.state.cropBox);
      await this.props.cropImage(this.props.theImage._id, x, y, width, height)
      this.props.handleCloseCropper()
    } catch (e) {
      console.log(e);
    } finally {}

  }

  onKeyPress = (event) => {
    if (event.charCode === 13) { // enter key pressed
      event.preventDefault()
      this.handleSubmit()
    }
  }

  render() {
    // + this.props.theImage.originalImage.filename
    //var imageSource = 'https://s3.amazonaws.com/thetripbeyond/' + this.props.theImage.originalImage.filename
    //console.log("IMAGE SOURCE:  " + imageSource);
    return (
      <div>
        <Dialog open={this.props.cropOpen} transition={Slide} onRequestClose={this.props.handleCloseCropper} onKeyPress={this.onKeyPress}>
          <DialogContent>
            <ImageCrop updateCropBox={this.updateCropBox} minCropWidthOnCanvas={120} src={'https://s3.amazonaws.com/thetripbeyond/' + this.props.theImage.originalImage.filename}/>
          </DialogContent>
          <DialogActions>
            <Button raised color="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
            <Button raised color="primary" onClick={this.props.handleCloseCropper}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }

}

HeadlineImageCrop.propTypes = {
  cropImage: PropTypes.func.isRequired,
  cropOpen: PropTypes.bool.isRequired,
  handleCloseCropper: PropTypes.func.isRequired,
  theImage: PropTypes.object.isRequired
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
      browserHeadlineImage {
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

export default WithCropImageMutation(HeadlineImageCrop)
