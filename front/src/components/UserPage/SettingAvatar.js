import React, {Component} from 'react'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import ImageInsert from '../StoryEditor/sidebar/ImageInsert'
import willUploadImage from '../../lib/ImageUpload'
import willExtractOrientation from '../../lib/ExtractOrientation'
import willExtractSize from '../../lib/ExtractSize'
import CONSTS from '../../lib/consts'

import testAvatar from '../../images/testAvatar.jpg'

export default class SettingAvatar extends Component {
	state = {
		cropOpen: false,
		tempCropImage: null
	}

	uploadFile = async (file) => {
		try {
			let localImageData = await willExtractOrientation(file)
			let imageSize = await willExtractSize(localImageData)
			// Catergory: 2 Avatar
			let image = await willUploadImage(
				file,
				2,
				'5a92039ef3b1a10028f35c4c',
				imageSize.width,
				imageSize.height
			)
			this.handleOpenCropper(image)
		} catch (e) {
			console.log("Avatar Image Upload Error: " + e);
		} finally {}
	}

	handleOpenCropper = (image) => {
		this.setState({tempCropImage: image, cropOpen: true})
	}
	handleCloseCropper = () => {
		this.setState({tempCropImage: null, cropOpen: false});
	}

	render() {
		const {tempCropImage} = this.state
		return (
			<div>
				<ImageInsert uploadFile={this.uploadFile}/> {
					tempCropImage && tempCropImage.originalImage && <div>
							<Cropper
								style={{
									height: 400,
									width: '100%'
								}}
								viewMode={1}
								aspectRatio={1 / 1}
								guides={false}
								movable={false}
								zoomable={false}
								scalable={false}
								zoomOnTouch={false}
								toggleDragModeOnDblclick={false}
								minCropBoxWidth={100}
								preview=".img-preview"
								src={CONSTS.BUCKET_NAME + tempCropImage.originalImage.filename}
								ref={(cropper) => {
									this.cropper = cropper
								}}/>
							<div style={{
									width: 200,
									height: 200
								}}>
								<div
									className="img-preview"
									style={{
										width: '100%',
										height: 200,
										overflow: 'hidden'
									}}/>
							</div>

						</div>
				}

			</div>
		)
	}
}
