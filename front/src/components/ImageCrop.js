import React, {Component} from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import PropTypes from 'prop-types';

class ImageCrop extends Component {

  crop = (e) => {
    //console.log(e);

    // image in dataUrl
    //console.log(this.refs.cropper.getCroppedCanvas().toDataURL());

    let {x, y, width, height} = e.detail
    this.props.updateCropBox(x, y, width, height)

  }

  render() {
    let minCropWidth = this.props.minCropWidthOnCanvas || 100

    return (<Cropper ref='cropper' src={this.props.src} style={{
      height: 600,
      width: '100%'
    }} crop={this.crop} viewMode={1} background={false} aspectRatio={3 / 1} guides={false} // Cropper options
  movable={false} zoomable={false} scalable={false} zoomOnTouch={false} toggleDragModeOnDblclick={false} // Disable Image Move
  minCropBoxWidth={minCropWidth}/>);
  }
}

ImageCrop.propTypes = {
  updateCropBox: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired
}

export default ImageCrop
