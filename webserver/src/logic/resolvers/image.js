import Jimp from 'jimp';
import Image from '../models/image';
import User from '../models/user';
import {willUploadObject, willDeleteObject} from '../../lib/S3';
import {willCheckDocumentOwnerShip} from '../../lib/resolverHelpers';
import uuidv4 from 'uuid/v4';

module.exports = {

  Query: {
    image: async(parent, args, context) => {
      return Image.load(args.imageID)
    }
  },

  Mutation: {
    cropImage: async(parent, args, context) => {
      let cropAt = {
        x: args.input.x,
        y: args.input.y,
        width: args.input.width,
        height: args.input.height
      }
      willCustomCropUpload(args.input.imageID, cropAt, context)
    }
  }
}

const willCustomCropUpload = async(imageID, cropAt, context) => {

  try {
    let image = await willCheckDocumentOwnerShip(imageID, context, 'image')
    let origImageName = image.originalImage.filename
    let extension = origImageName.split('.').pop()
    //let newName = generateImageName("customV1-", extension)
    let newName = "customV1-" + uuidv4() + '.' + extension
    let origImapeURL = 'https://s3.amazonaws.com/thetripbeyond/' + origImageName

    switch (image.catergory) {
        // Headline Image
      case 1:
        var [newImage,
          draft] = await Promise.all([
          willCustomCrop(origImapeURL, cropAt),
          willCheckDocumentOwnerShip(image.draft, context, 'draft')
        ]);
        draft.headlineImage = image._id;
        image.browserHeadlineImage = {
          filename: newName,
          size: {
            width: cropAt.width,
            height: cropAt.height
          }
        }
        // Sequential! Don't Trade Consistency with A Little Speed!
        await willUploadObject(newName, newImage);
        await image.save();
        await draft.save();
        break;
        // Avatar Image
      case 2:
        var [newImage,
          user] = await Promise.all([
          willCustomCrop(origImapeURL, cropAt),
          User.findById(context.sessionUser.user._id)
        ]);
        break;
      default:
    }

    image[imageType] = {
      filename: newName
    }

    await willUploadObject(newName, newImage)
  } catch (e) {
    return new Error(e)
  } finally {}

}

const willCustomCrop = (inputURL, cropAt) => new Promise((resolve, reject) => {
  Jimp.read(inputURL).then((image) => {
    let {x, y, width, height} = cropAt
    y = -1
    image.crop(x, y, width, height).getBuffer(Jimp.AUTO, (err, newImage) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve(newImage)
    })
  }).catch((err) => {
    return reject(new Error(err))
  })
})
