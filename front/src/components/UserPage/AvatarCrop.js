import React, {Component} from 'react'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import CONSTS from '../../lib/consts'

export default class AvatarCrop extends Component {
	render() {
		const minCropWidth = 124
		const src = CONSTS.BUCKET_NAME + this.props.image.originalImage.filename
		const {width, height} = this.props.image.originalImage.size
		const scale = height > CONSTS.AVATAR_CROP
			? CONSTS.AVATAR_CROP / height
			: 1
		const imgHeight = height * scale
		const imgWidth = width * scale
		return (
			<div style={{
					height: imgHeight,
					width: imgWidth
				}}>
				<Cropper
					style={{
						height: imgHeight,
						width: imgWidth
					}}
					viewMode={1}
					aspectRatio={1 / 1}
					guides={false}
					movable={false}
					zoomable={false}
					scalable={false}
					zoomOnTouch={false}
					toggleDragModeOnDblclick={false}
					minCropBoxWidth={minCropWidth}
					preview=".img-preview"
					src={src}
					ref={(cropper) => {
						this.cropper = cropper
					}}/>
				<div style={{
						width: minCropWidth,
						height: minCropWidth
					}}>
					<div
						className="img-preview"
						style={{
							width: minCropWidth,
							height: minCropWidth,
							overflow: 'hidden'
						}}/>
				</div>
			</div>
		)
	}
}
