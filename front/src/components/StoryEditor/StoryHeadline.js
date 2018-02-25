import React from 'react';

//
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Edit from "material-ui-icons/Edit";
import Done from 'material-ui-icons/Done'
import Clear from 'material-ui-icons/Clear'

// import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog';
import Dialog from 'material-ui/Dialog'
//
import CONSTS from '../../lib/consts';
import ImageInsert from './sidebar/ImageInsert';
import ImageCrop from './ImageCrop';
import defaultImageHeadline from '../../images/headlineImage.jpg';

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
						onKeyPress={onKeyPress} maxWidth={false}>
						<ImageCrop
							updateCropBox={updateCropBox}
							minCropWidthOnCanvas={120}
							src={CONSTS.BUCKET_NAME + tempCropImage.originalImage.filename}
							imgSize={tempCropImage.originalImage.size}
							cropBox={cropBox}/>
						<div className="headlineAction">
							<div className="dialogActionItem">
								<Button color="primary" onClick={handleSubmit}>
									<Done/>
								</Button>
							</div>
							<div className="dialogActionItem">
								<Button color="primary" onClick={handleCloseCropper}>
									<Clear/>
								</Button>
							</div>
						</div>
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
	var imageSource = CONSTS.BUCKET_NAME + props.headlineImage.browserHeadlineImage.filename
	var headlineImage = props.headlineImage
	return (
		<div>
			<div className='headlineWithImage'>
				<ImageInsert uploadFile={props.uploadFile} comment='Upload New Headline Image'/>
				Edit Current Headline Image
				<IconButton
					aria-label="Edit"
					onClick={() => props.handleOpenCropper(headlineImage)}>
					<Edit/>
				</IconButton>
			</div>
			<img className="headlineImage" src={imageSource} alt='headline'/>
		</div>
	)
}

const HeadlineWithoutUserImage = (props) => {
	return (
		<div className="headlineImage">
			<div className='headlineWithoutImage'>
				<ImageInsert uploadFile={props.uploadFile} comment='Upload Headline Image'/>
				Suggest Use Original Image or Image Higher than 1980px
			</div>
			<img className="headlineImage" src={defaultImageHeadline} alt='headline'/>
		</div>
	)
}

export default StoryHeadline
