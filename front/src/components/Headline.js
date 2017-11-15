import React, {Component} from 'react';
import ReactCrop, {makeAspectCrop} from 'react-image-crop'
import imageTest from '../images/c.jpg';
import 'react-image-crop/dist/ReactCrop.css';

class Headline extends Component {
  state = {
    crop: {
      x: 0,
      y: 0,
      aspect: 3 / 1
    },
    //maxHeight: 200
  }

  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        y: 0,
        aspect: 3 / 1,
        width: 100
      }, image.naturalWidth / image.naturalHeight),
      image
    });
  }

  onCropComplete = (crop, pixelCrop) => {
    console.log('onCropComplete, pixelCrop:', pixelCrop);
  }

  onCropChange = (crop) => {
    this.setState({crop});
  }

  render() {
    return (
      <div>
        <ReactCrop crop={this.state.crop} src={imageTest} onImageLoaded={this.onImageLoaded} onChange={this.onCropChange} onComplete={this.onCropComplete}/>
      </div>
    );
  }
}

export default Headline;
