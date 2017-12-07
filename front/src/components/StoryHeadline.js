import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Edit from "material-ui-icons/Edit";
import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog';

//
import willUploadImage from '../lib/ImageUpload';
import {CropImageMutation} from '../graphql/image';
import {DraftDetailsQuery} from '../graphql/draft';

//
import ImageInsert from './StoryEditor/ImageInsert';
import ImageCrop from './ImageCrop';
import willExtractOrientation from "./StoryEditor/util/ExtractOrientation"
import willExtractSize from '../components/StoryEditor/util/ExtractSize';

class StoryHeadline extends Component {
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
			console.log(image);
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
			// console.log("SUBMIT"); console.log(this.state.tempCropImage);
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
		const {cropBox, cropOpen, tempCropImage} = this.state
		const {headlineImage} = this.props.draft
		// console.log(this.props.draft); console.log(headlineImage);

		return (
			<div>
				{
					tempCropImage && tempCropImage.originalImage && <Dialog
							open={cropOpen}
							transition={Slide}
							onRequestClose={this.handleCloseCropper}
							onKeyPress={this.onKeyPress}>
							<DialogContent>
								<ImageCrop
									updateCropBox={this.updateCropBox}
									minCropWidthOnCanvas={120}
									src={'https://s3.amazonaws.com/thetripbeyond/' + tempCropImage.originalImage.filename}/>
							</DialogContent>
							<div>
								Current Croping Area: {cropBox.width}
								X {cropBox.height}
							</div>
							<DialogActions>
								<Button color="primary" onClick={this.handleSubmit}>
									Submit
								</Button>
								<Button color="primary" onClick={this.handleCloseCropper}>
									Cancel
								</Button>
							</DialogActions>
						</Dialog>
				}
				<div>
					{
						(headlineImage && headlineImage.browserHeadlineImage)
							? <Headline
									headlineImage={headlineImage}
									uploadFile={this.uploadFile}
									handleOpenCropper={this.handleOpenCropper}/>
							: <EmptyHeadline uploadFile={this.uploadFile}/>
					}
				</div>
			</div>
		);
	}
}

StoryHeadline.propTypes = {
	draft: PropTypes.object.isRequired,
	cropImage: PropTypes.func.isRequired
}

const Headline = (props) => {
	var imageSource = 'https://s3.amazonaws.com/thetripbeyond/' + props.headlineImage.browserHeadlineImage.filename
	var headlineImage = props.headlineImage
	return (
		<div>
			<img className="headlineImage" src={imageSource} alt='headline'/>
			<div>
				<ImageInsert uploadFile={props.uploadFile} comment='Upload New Headline Image'/>
			</div>
			<div>
				Edit Current Headline Image
				<IconButton
					aria-label="Edit"
					onClick={() => props.handleOpenCropper(headlineImage)}>
					<Edit/>
				</IconButton>
			</div>
		</div>
	)
}

const EmptyHeadline = (props) => {
	return (
		<div className="headline">
			<div>
				Suggest Use Original Image or Image Higher than 1980px
				<ImageInsert uploadFile={props.uploadFile} comment='Upload Headline Image'/>
			</div>
		</div>
	)
}

export const WithCropImageMutation = graphql(CropImageMutation, {
	props: ({mutate}) => ({
		cropImage: (imageID, x, y, width, heigth) => mutate({
			variables: {
				input: {
					imageID: imageID,
					x: x,
					y: y,
					width: width,
					height: heigth
				}
			},
			update: (store, {data: {
					cropImage
				}}) => {
				// Read the data from the cache for this query.
				const data = store.readQuery({
					query: DraftDetailsQuery,
					variables: {
						draftID: cropImage.draft
					}
				});
				// change headline image.
				data.draft.headlineImage = cropImage
				// Write the data back to the cache.
				store.writeQuery({
					query: DraftDetailsQuery,
					variables: {
						draftID: cropImage.draft
					},
					data
				});

			}
		})
	})
})

export default WithCropImageMutation(StoryHeadline)