import React, {Component} from 'react';
import PropTypes from 'prop-types';

//
import willUploadImage from '../../lib/ImageUpload';
import {WithCropImageMutation} from '../../graphql/image';
import willExtractOrientation from "../../lib/ExtractOrientation";
import willExtractSize from '../../lib/ExtractSize';

//
import StoryHeadline from './StoryHeadline';
import StoryTitle from './StoryTitle'

class StoryHeadlineContainer extends Component {
	state = {
		cropBox: {},
		cropOpen: false, // Control Headline Image Cropper Open/Close
		// Temp crop image always starting from null, can only be set by
		tempCropImage: null
	}

	// Upload New Crop Image, Set tempCropImage
	uploadFile = async (file) => {
		try {
			// {orientation: 8, src: <localURL>}
			let localImageData = await willExtractOrientation(file)
			let imageSize = await willExtractSize(localImageData)
			let draftID = this.props.match.params._id
			// Catergory: 1 HeadlineImage
			let image = await willUploadImage(
				file,
				1,
				draftID,
				imageSize.width,
				imageSize.height
			)
			this.handleOpenCropper(image)
		} catch (e) {
			console.log("Headline Image Upload Error: " + e);
		} finally {}
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
	}

	handleSubmit = async () => {
		try {
			let {x, y, width, height} = this.state.cropBox
			let {cropImage} = this.props
			//console.log("SUBMIT"); console.log(this.state.tempCropImage);
			cropImage(this.state.tempCropImage._id, x, y, width, height)
		} catch (e) {
			console.log(e);
		} finally {
			this.handleCloseCropper()
		}
	}
	handleCloseCropper = () => {
		this.setState({tempCropImage: null, cropOpen: false});
	}
	handleOpenCropper = (tempCropImage) => {
		this.setState({tempCropImage: tempCropImage, cropOpen: true})
	}
	onKeyPress = (event) => {
		if (event.charCode === 13) { // enter key pressed
			event.preventDefault()
			this.handleSubmit()
		}
	}

	render() {
		return (
			<div className='headlineContainer'>
				<StoryTitle title={this.props.draft.title} match={this.props.match}/>
				<StoryHeadline
					state={this.state}
					headlineImage={this.props.draft.headlineImage}
					onKeyPress={this.onKeyPress}
					updateCropBox={this.updateCropBox}
					handleSubmit={this.handleSubmit}
					handleCloseCropper={this.handleCloseCropper}
					handleOpenCropper={this.handleOpenCropper}
					uploadFile={this.uploadFile}/>
			</div>
		)
	}
}

StoryHeadlineContainer.propTypes = {
	draft: PropTypes.object.isRequired,
	cropImage: PropTypes.func.isRequired
}

export default WithCropImageMutation(StoryHeadlineContainer)