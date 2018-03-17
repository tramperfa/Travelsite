import multer from 'multer';
import sharp from 'sharp';
import uuidv4 from 'uuid/v4';
import parser from 'exif-parser';
//import passport from 'passport'; import Jimp from 'jimp';

import Image from '../logic/models/image';
//import Draft from '../logic/models/draft';
import {willCheckDocumentOwnerShip, checkLoginBoolean} from './resolverHelpers';
import {willUploadObject} from './S3';
import errorType from './errorType'

// Multer config memory storage keeps file data in a buffer
const upload = multer({
	storage: multer.memoryStorage(),
	// file size limitation in bytes
	limits: {
		fileSize: 52428800
	}
});

export const imageSize = {
	browserStoryImage: {
		width: 700
	},
	browserCommentImage: {
		width: 300
	},
	browserCoverImage: {
		width: 220,
		height: 150
	},
	browserUserHomeCoverImage: {
		width: 680,
		height: 400
	},
	// StoryReader, UserHome
	avatar124px: {
		width: 124,
		height: 124
	},
	//Following, Comment, Reply, Review
	avatar48px: {
		width: 48,
		height: 48
	},
	//Logged-in User Navigation
	avatar36px: {
		width: 36,
		height: 36
	},

	//Homepage StoryList
	avatar20px: {
		width: 20,
		height: 20
	}
}

module.exports = function (app) {
	app.post("/upload", upload.single('imageupload'), async (req, res) => {
		const {catergory, extension, draftID, origWidth, origHeight} = req.body

		var origSize = {
			width: origWidth,
			height: origHeight
		}
		const context = {
			sessionUser: req.session.passport
		}

		try {
			// protect end point from random requests
			if (!checkLoginBoolean(context)) {
				throw errorType(1)
			}

			var image = new Image(
				{author: context.sessionUser.user._id, draft: draftID, catergory: catergory}
			)
			//, );
			const buffer = await sharp(req.file.buffer).rotate().toBuffer()

			// EXIF ONLY applies to JPEG and TIFF FORMAT
			if (extension === 'jpg' || extension === 'jpeg' || extension === 'tiff') {
				// Add EXIF
				parseEXIF(req.file.buffer, image, origSize)
			}

			switch (catergory) {
					// Story Image
				case '0':
					{
						var [draft] = await Promise.all([
							willCheckDocumentOwnerShip(draftID, context, 'leanDraft'),
							originalSizeUpload(buffer, extension, origSize, image),
							widthBasedResizeUpload(buffer, extension, origSize, 'browserStoryImage', image),
							widthBasedResizeUpload(
								buffer,
								extension,
								origSize,
								'browserCommentImage',
								image
							),
							autoCropUpload(buffer, extension, 'browserCoverImage', image),
							autoCropUpload(buffer, extension, 'browserUserHomeCoverImage', image)
						]);
						// Save Image Before Draft
						await image.save();
						let images = draft.images;
						//console.log(images);
						images.push(image._id);
						await draft.save();
						let returnImage = {
							_id: image._id,
							browserStoryImage: {
								filename: image.browserStoryImage.filename,
								size: {
									width: image.browserStoryImage.size.width,
									height: image.browserStoryImage.size.height,
									__typename: "Size"
								},
								__typename: "ImageFile"
							},
							browserCommentImage: {
								filename: image.browserCommentImage.filename,
								size: {
									width: image.browserCommentImage.size.width,
									height: image.browserCommentImage.size.height,
									__typename: "Size"
								},
								__typename: "ImageFile"
							},
							__typename: "Image"
						}
						res.send(returnImage);
						break;
					}
					// Headline Image, Avatar Image
				case '1':
				case '2':
					await originalSizeUpload(buffer, extension, origSize, image);
					await image.save();
					res.send(image);
					break;
				default:
					throw errorType(3)
			}
		} catch (e) {
			console.log(e);
			return res.status(400).send(e);
		}
	})
}

const parseDate = (s) => {
	var b = s.split(/\D/);
	return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

const parseEXIF = (buffer, image, origSize) => {
	//Parse Out EXIF With Processed ImageSize
	var result = parser.create(buffer).enableSimpleValues(false).parse()
	result.imageSize = origSize
	image.extraData = result.tags
	if (result.tags.DateTimeOriginal) {
		image.takenTime = parseDate(result.tags.DateTimeOriginal).toString();
	}
	return result
}

const generateImageName = (prefix, extension) => {
	return prefix + uuidv4() + '.' + extension
}

const originalSizeUpload = async (inputBuffer, extension, origSize, image) => {
	let newName = generateImageName("origV1-", extension)
	image.originalImage = {
		filename: newName,
		size: origSize
	}
	await willUploadObject(newName, inputBuffer)
}

const widthBasedResizeUpload = async (
	inputBuffer,
	extension,
	origSize,
	imageType,
	image
) => {
	let newName = generateImageName("storyV1-", extension)
	var requireSize = imageSize[imageType]
	var finalSize;
	var newImage;

	// Resize to match required width
	if (origSize.width > requireSize.width) {
		newImage = await sharp(inputBuffer).resize(requireSize.width, undefined).toBuffer()
		var newHeight = Math.round(
			origSize.height / origSize.width * requireSize.width
		)
		finalSize = {
			width: requireSize.width,
			height: newHeight
		}
		// Upload image width less than required width, No Resize
	} else {
		newImage = inputBuffer
		finalSize = origSize
	}

	image[imageType] = {
		filename: newName,
		size: finalSize
	}
	await willUploadObject(newName, newImage)

}

const autoCropUpload = async (inputBuffer, extension, imageType, image) => {
	let newName = generateImageName("autoV1-", extension)
	var requireSize = imageSize[imageType]
	// If Image Original Size is Smaller, First Enlarge to Match Require Size
	// Otherwise, "Hole" will be left at required size
	var newImage = await sharp(inputBuffer).resize(
		requireSize.width,
		requireSize.height
	).crop().toBuffer()

	image[imageType] = {
		filename: newName,
		size: requireSize
	}
	await willUploadObject(newName, newImage)
}

// / / Hold off GPS feature if (result.tags.GPSLatitude &&
// result.tags.GPSLongitude) { image.takenLocation = {     latitude:
// result.tags.GPSLatitude, longitude: result.tags.GPSLongitude } }  Double
// check height calculation is correct
// sharp(inputBuffer).rotate().resize(requireSize.width,
// requireSize.height).toBuffer(function(err, data, info) {   console.log(info);
// })  const parseSize
// = (buffer, image) => {   var result =
// parser.create(buffer).enableImageSize(true).parse()   return
// result.getImageSize() }  Get The Right Size After Taking Orientation Through
// .rotate() var origSize = parseSize(buffer, image)