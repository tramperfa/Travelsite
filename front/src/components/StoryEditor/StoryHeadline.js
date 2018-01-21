import React from 'react';

//
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Edit from "material-ui-icons/Edit";
import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog';

//
import ImageInsert from './ImageInsert';
import ImageCrop from './ImageCrop';
import imageHeadline from '../../images/headlineImage.jpg';

const StoryHeadline = ({
	state,
	headlineImage,
	onKeyPress,
	updateCropBox,
	handleSubmit,
	handleCloseCropper,
	handleOpenCropper,
	uploadFile
}) => {
	const {cropBox, cropOpen, tempCropImage} = state;

	return (
		//
		<div>
			{
				tempCropImage && tempCropImage.originalImage && <Dialog open={cropOpen} transition={Slide}
						//onRequestClose={handleCloseCropper}
						onKeyPress={onKeyPress}>
						<DialogContent>
							<ImageCrop
								updateCropBox={updateCropBox}
								minCropWidthOnCanvas={120}
								src={'https://s3.amazonaws.com/thetripbeyond/' + tempCropImage.originalImage.filename}/>
						</DialogContent>
						<div>
							Current Croping Area: {cropBox.width}
							X {cropBox.height}
						</div>
						<DialogActions>
							<Button color="primary" onClick={handleSubmit}>
								Submit
							</Button>
							<Button color="primary" onClick={handleCloseCropper}>
								Cancel
							</Button>
						</DialogActions>
					</Dialog>
			}
			<div>
				{
					(headlineImage && headlineImage.browserHeadlineImage)
						? <HeadlineWithUserImage
								headlineImage={headlineImage}
								uploadFile={uploadFile}
								handleOpenCropper={handleOpenCropper}/>
						: <HeadlineWithoutUserImage uploadFile={uploadFile}/>
				}
			</div>
		</div>
	)
}

const HeadlineWithUserImage = (props) => {
	var imageSource = 'https://s3.amazonaws.com/thetripbeyond/' + props.headlineImage.browserHeadlineImage.filename
	var headlineImage = props.headlineImage
	return (
		<div>
			<span>
				<img className="headlineImage" src={imageSource} alt='headline'/>
				<ImageInsert uploadFile={props.uploadFile} comment='Upload New Headline Image'/>
				Edit Current Headline Image
				<IconButton
					aria-label="Edit"
					onClick={() => props.handleOpenCropper(headlineImage)}>
					<Edit/>
				</IconButton>
			</span>
		</div>
	)
}

const HeadlineWithoutUserImage = (props) => {
	return (
		<div className="headlineImage">
			<span>
				<img className="headlineImage" src={imageHeadline} alt='headline'/>
				<ImageInsert uploadFile={props.uploadFile} comment='Upload Headline Image'/>
				Suggest Use Original Image or Image Higher than 1980px
			</span>
		</div>
	)
}

export default StoryHeadline
