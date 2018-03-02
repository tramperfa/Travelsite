import React, {Component} from 'react'

import willUploadImage from '../../lib/ImageUpload'
import willExtractOrientation from '../../lib/ExtractOrientation'
import willExtractSize from '../../lib/ExtractSize'
import ImageInsert from '../StoryEditor/sidebar/ImageInsert'
import AvatarCrop from './AvatarCrop'
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
				<ImageInsert uploadFile={this.uploadFile}/> {tempCropImage && tempCropImage.originalImage && <AvatarCrop image={tempCropImage}/>}

			</div>
		)
	}
}
