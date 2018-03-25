import Jimp from 'jimp';
import uuidv4 from 'uuid/v4';
import sharp from 'sharp';
//import Image from '../models/image';

//
import {willCheckDocumentOwnerShip} from '../../lib/resolverHelpers';
import {willUploadObject} from '../../lib/S3';

import errorType from '../../lib/errorType';
//import Image from '../models/image';
import User from '../models/user';

const imageSize = {
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

module.exports = {

	Query: {
		image: async (parent, args, context) => {
			console.log("IMAGE QUERY CALLED WITH ID : " + args.imageID)
			if (!args.imageID) {
				return null
			}
			return willCheckDocumentOwnerShip(args.imageID, context, 'image')
			//Image.load(args.imageID)
		}
	},

	Mutation: {
		cropImage: async (parent, args, context) => {
			let cropAt = {
				x: args.input.x,
				y: args.input.y,
				width: args.input.width,
				height: args.input.height
			}
			return willCustomCropUpload(args.input.imageID, cropAt, context)
		}
	}
}

const willCustomCropUpload = async (imageID, cropAt, context) => {
	try {
		let image = await willCheckDocumentOwnerShip(imageID, context, 'image')
		let origImageName = image.originalImage.filename
		let extension = origImageName.split('.').pop()
		let origImapeURL = 'https://s3.amazonaws.com/thetripbeyond/' +
				origImageName
		// Image catergory is determined by the catergory field in image document when
		// it is originally created
		var newImage;
		var draft;
		var user;
		switch (image.catergory) {
				// Headline Image
			case 1:
				{
					[newImage, draft] = await Promise.all([
						willCustomCrop(origImapeURL, cropAt),
						willCheckDocumentOwnerShip(image.draft, context, 'draft')
					]);
					draft.headlineImageID = image._id
					draft.lastUpdate = new Date().toISOString()
					let newHeadlineImageName = "customV1-" + uuidv4() + '.' + extension
					image.browserHeadlineImage = {
						filename: newHeadlineImageName,
						size: {
							width: cropAt.width,
							height: cropAt.height
						}
					}
					// SEQUENTIAL!!! Don't Trade Consistency with A Little Speed!  var finalImage =
					// await sharp(newImage).toBuffer(); console.log("COMPRESSED AGAIN");
					await willUploadObject(newHeadlineImageName, newImage);
					await image.save();
					await draft.save();
					break;
					// Avatar Image TO BE FINISH
				}
			case 2:
				[newImage, user] = await Promise.all([
					willCustomCrop(origImapeURL, cropAt),
					User.findById(context.sessionUser.user._id)
				]);
				await willCompressUploadAvatar(image, newImage, user, extension)
				break;
			default:
		}
		return image;
	} catch (e) {
		return e
	}

}

const willCustomCrop = (inputURL, cropAt) => new Promise((resolve, reject) => {
	Jimp.read(inputURL).then((image) => {
		let {x, y, width, height} = cropAt
		image.quality(60).crop(x, y, width, height).getBuffer(
			Jimp.AUTO,
			(err, newImage) => {
				if (err) {
					//TODO LOG
					console.log(err);
					return reject(errorType(2))
				}
				return resolve(newImage)
			}
		)
	}).catch((err) => {
		//TODO LOG
		console.log(err);
		return reject(errorType(2))
	})
})

const willCompressUploadAvatar = async (image, newImage, user, extension) => {

	await Promise.all([
		willCompressUploadSingleAvatar('avatar124px', image, extension, newImage),
		//
		willCompressUploadSingleAvatar('avatar48px', image, extension, newImage),
		willCompressUploadSingleAvatar('avatar36px', image, extension, newImage),
		willCompressUploadSingleAvatar('avatar20px', image, extension, newImage)
	]);
	user.avatarID = image._id;
	await image.save();
	await user.save();
}

const willCompressUploadSingleAvatar = async (
	avatarType,
	image,
	extension,
	newImage
) => {
	let newName = "customV1-" + uuidv4() + '.' + extension
	let requireSize = imageSize[avatarType]
	let avatarImage = await sharp(newImage).resize(
		requireSize.width,
		requireSize.height
	).toBuffer()
	image[avatarType] = {
		filename: newName,
		size: imageSize[avatarType]
	}
	await willUploadObject(newName, avatarImage)
}
