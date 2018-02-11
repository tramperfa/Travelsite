import React, {Component} from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import PropTypes from 'prop-types';

import CONSTS from '../../lib/consts'

class ImageCrop extends Component {

	crop = (e) => {
		// console.log(e); image in dataUrl
		// console.log(this.refs.cropper.getCroppedCanvas().toDataURL());

		let {x, y, width, height} = e.detail
		this.props.updateCropBox(x, y, width, height)

	}

	render() {
		let minCropWidth = this.props.minCropWidthOnCanvas || 100
		const {width, height} = this.props.imgSize
		const scale = height > CONSTS.HEADLINE_CROP
			? CONSTS.HEADLINE_CROP / height
			: 1
		const imgHeight = height * scale
		const imgWidth = width * scale
		const {cropBox} = this.props
		const centerX = cropBox.x * scale + (cropBox.width * scale / 2)
		const centerY = cropBox.y * scale + (cropBox.height * scale / 2)
		const cord = cropBox.width + ' x ' + cropBox.height
		return (
			<div style={{
					height: imgHeight,
					width: imgWidth
				}}>
				{
					cropBox.x !== undefined && <div
							className="headlineCropperCord"
							style={{
								position: 'absolute',
								top: centerY,
								left: centerX
							}}>
							{cord}
						</div>
				}
				<Cropper ref='cropper' src={this.props.src} style={{
						height: imgHeight,
						width: imgWidth
					}} crop={this.crop} viewMode={1} background={false} aspectRatio={3 / 1} guides={false}
					// Cropper options
					movable={false} zoomable={false} scalable={false} zoomOnTouch={false} toggleDragModeOnDblclick={false}
					// Disable Image Move
					minCropBoxWidth={minCropWidth}/>
			</div>
		);
	}
}

ImageCrop.propTypes = {
	updateCropBox: PropTypes.func.isRequired,
	src: PropTypes.string.isRequired
}

export default ImageCrop
