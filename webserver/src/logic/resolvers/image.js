import Jimp from 'jimp';
import uuidv4 from 'uuid/v4';
import sharp from 'sharp';

//
import {willCheckDocumentOwnerShip} from '../../lib/resolverHelpers';
import {willUploadObject, willDeleteObject} from '../../lib/S3';

//import Image from '../models/image';
import User from '../models/user';
import {imageSize} from '../../lib/upload';

module.exports = {

	Query: {
		image: async (parent, args, context) => {
			return Image.load(args.imageID)
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
		switch (image.catergory) {
				// Headline Image
			case 1:
				var [newImage, draft] = await Promise.all([
					willCustomCrop(origImapeURL, cropAt),
					willCheckDocumentOwnerShip(image.draft, context, 'draft')
				]);
				draft.headlineImage = image._id;
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
			case 2:
				var [newImage, user] = await Promise.all([
					willCustomCrop(origImapeURL, cropAt),
					User.findById(context.sessionUser.user._id)
				]);
				await willCompressUploadAvatar(image, newImage, user)
				break;
			default:
		}

		return image;
	} catch (e) {
		return e
	} finally {}

}

const willCustomCrop = (inputURL, cropAt) => new Promise((resolve, reject) => {
	Jimp.read(inputURL).then((image) => {
		let {x, y, width, height} = cropAt
		image.quality(60).crop(x, y, width, height).getBuffer(
			Jimp.AUTO,
			(err, newImage) => {
				if (err) {
					return reject(new Error(err))
				}
				return resolve(newImage)
			}
		)
	}).catch((err) => {
		return reject(new Error(err))
	})
})

const willCompressUploadAvatar = async (image, newImage, user) => {

	await Promise.all([
		willCompressUploadSingleAvatar('avatar124px'),
		//
		willCompressUploadSingleAvatar('avatar48px'),
		willCompressUploadSingleAvatar('avatar36px'),
		willCompressUploadSingleAvatar('avatar20px')
	]);
	user.avatar = image._id;
	await image.save();
	await user.save();
}

const willCompressUploadSingleAvatar = async (avatarType) => {
	let newName = "customV1-" + uuidv4() + '.' + extension
	let requireSize = imageSize[avatarType]
	let avatarImage = await sharp(newImage).resize(
		requireSize.width,
		requireSize.height
	).toBuffer()
	image[avatar] = {
		filename: newName,
		size: requireSize
	}
	await willUploadObject(newName, avatarImage)
}
