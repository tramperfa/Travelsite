import React, {Component} from 'react';
import ReactCrop, {makeAspectCrop} from 'react-image-crop'
import imageTest from '../images/g.jpeg';
import 'react-image-crop/dist/ReactCrop.css';
import Button from 'material-ui/Button';

class Headline extends Component {
  state = {
    crop: {}
    // x: 0,
    // y: 0
    //aspect: 3 / 1
    //}
  }

  handleCrop = async() => {}

  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        // calculate the center starting point
        y: Math.round((image.naturalHeight - image.naturalWidth / 3) * 100 / 2 / image.naturalHeight),
        aspect: 3 / 1,
        width: 100
      }, image.naturalWidth / image.naturalHeight),
      image
    });
  }

  onCropComplete = (crop, pixelCrop) => {
    console.log('To Be Displayed Inside Image Croping Area:   ', pixelCrop.width + ' X ' + pixelCrop.height);
  }

  onCropChange = (crop) => {
    this.setState({crop});
  }

  render() {
    return (
      <div>
        <ReactCrop crop={this.state.crop} src={imageTest} onImageLoaded={this.onImageLoaded} onChange={this.onCropChange} onComplete={this.onCropComplete}/>

        <Button raised color="primary" onClick={this.handleCrop}>
          Submit
        </Button>
        <Button raised color="primary">
          Cancel
        </Button>
      </div>
    );
  }
}

export default Headline;
