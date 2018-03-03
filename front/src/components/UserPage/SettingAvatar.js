import React, {Component} from 'react'

import {WithCropAvatarImageMutation} from '../../graphql/image'
import willUploadImage from '../../lib/ImageUpload'
import willExtractOrientation from '../../lib/ExtractOrientation'
import willExtractSize from '../../lib/ExtractSize'
import ImageInsert from '../StoryEditor/sidebar/ImageInsert'
import AvatarCrop from './AvatarCrop'
import testAvatar from '../../images/testAvatar.jpg'

class SettingAvatar extends Component {
	state = {
		cropOpen: false,
		tempCropImage: null,
		cropBox: null
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
	updateCropBox = (box) => {
		this.setState({
			cropBox: {
				x: box.x,
				y: box.y,
				width: box.width,
				height: box.height
			}
		})
	}

	cropConfirmed = () => {
		// console.log(this.state.cropBox);
		try {
			const {x, y, width, height} = this.state.cropBox
			this.props.cropImage(
				this.state.tempCropImage._id,
				Math.round(x),
				Math.round(y),
				Math.round(width),
				Math.round(height)
			)
		} catch (e) {
			console.log(e);
		} finally {
			this.handleCloseCropper()
		}
	}

	render() {
		const {tempCropImage} = this.state
		return (
			<div>
				<div>
					<img className="avatarCircle" src={this.props.currentAvatar} alt=''/>
				</div>
				<ImageInsert uploadFile={this.uploadFile} comment="Upload New Avatar"/> {
					tempCropImage && tempCropImage.originalImage && <AvatarCrop
							image={tempCropImage}
							updateCropBox={this.updateCropBox}
							confirm={this.cropConfirmed}
							cancel={this.handleCloseCropper}/>
				}

			</div>
		)
	}
}

export default WithCropAvatarImageMutation(SettingAvatar)