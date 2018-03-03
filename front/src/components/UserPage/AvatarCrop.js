import React, {Component} from 'react'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Button from 'material-ui/Button';
import Done from 'material-ui-icons/Done'
import Clear from 'material-ui-icons/Clear'

import CONSTS from '../../lib/consts'

export default class AvatarCrop extends Component {
	crop = (e) => {
		this.props.updateCropBox(e.detail)
	}

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
			<div>
				<div
					style={{
						height: imgHeight,
						width: imgWidth,
						display: 'flex'
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
						crop={this.crop}
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
								borderRadius: minCropWidth,
								overflow: 'hidden'
							}}/>
					</div>
				</div>
				<div style={{
						display: 'flex'
					}}>
					<Button onClick={this.props.confirm}>
						<Done/>
					</Button>
					<Button onClick={this.props.cancel}>
						<Clear/>
					</Button>
				</div>
			</div>
		)
	}
}
