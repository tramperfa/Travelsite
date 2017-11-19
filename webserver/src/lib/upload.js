import multer from 'multer';
import sharp from 'sharp';
import uuidv4 from 'uuid/v4';
import parser from 'exif-parser';
import passport from 'passport';
import Jimp from 'jimp';

import Image from '../logic/models/image';
import Draft from '../logic/models/draft';
import {willCheckDocumentOwnerShip, checkLogin} from './resolverHelpers';
import {willUploadObject, willDevareObject} from './S3';

// Multer config
// memory storage keeps file data in a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  // file size limitation in bytes
  limits: {
    fileSize: 52428800
  }
});

const imageSize = {
  browserStoryImage: {
    width: 700
  },
  browserCommentImage: {
    width: 300
  },
  browserCoverImage: {
    width: 220,
    height: 140
  },
  browserUserHomeCoverImage: {
    width: 680,
    height: 400
  }
}

module.exports = function(app, db) {
  app.post("/upload", upload.single('imageupload'), async(req, res) => {
    const {catergory, extension, draftID} = req.body
    try {
      // protect end point from random requests
      const context = {
        sessionUser: req.session.passport
      }
      checkLogin(context)

      const buffer = req.file.buffer
      var image = new Image({author: context.sessionUser.user._id, story: draftID, catergory: catergory});
      var result = parseEXIF(buffer, image)
      switch (catergory) {
          // Story Image
        case '0':
          var [draft] = await Promise.all([
            willCheckDocumentOwnerShip(draftID, context, 'draft'),
            originalSizeUpload(buffer, extension, image),
            widthBasedResizeUpload(buffer, extension, result.imageSize, 'browserStoryImage', image),
            widthBasedResizeUpload(buffer, extension, result.imageSize, 'browserCommentImage', image),
            autoCropUpload(buffer, extension, result.imageSize, 'browserCoverImage', image),
            autoCropUpload(buffer, extension, result.imageSize, 'browserUserHomeCoverImage', image)
          ]);
          break;
          // Headline Image, Avatar Image
        case '1':
        case '2':
          originalSizeUpload(buffer, extension, image);
          break;
        default:
          throw new Error("illegal image upload request")
      }
      await image.save()
      // Story Image Write to Draft Document
      if (catergory === '0') {
        let images = draft.images;
        images.push(image._id);
        await draft.save();
      }
      res.send(image);
    } catch (e) {
      console.log(e);
      return res.status(400).send(e);
    } finally {}
  })
}

const parseDate = (s) => {
  var b = s.split(/\D/);
  return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

const parseEXIF = (buffer, image) => {
  //Parse Out EXIF
  var result = parser.create(buffer).enableSimpleValues(false).parse()
  image.extraData = result.tags
  if (result.tags.DateTimeOriginal) {
    image.takenTime = parseDate(result.tags.DateTimeOriginal).toString();
  }
  return result
}

const generateImageName = (prefix, extension) => {
  return prefix + uuidv4() + '.' + extension
}

const originalSizeUpload = async(inputBuffer, extension, image) => {
  let newName = generateImageName("origV1-", extension)
  var newImage = await sharp(inputBuffer).toBuffer()
  image.originalImage = {
    filename: newName
  }
  await willUploadObject(newName, newImage)
}

const widthBasedResizeUpload = async(inputBuffer, extension, origSize, imageType, image) => {
  let newName = generateImageName("storyV1-", extension)
  var requireSize = imageSize[imageType]
  var finalSize;

  // Resize to match required width
  if (origSize.width > requireSize.width) {
    var newImage = await sharp(inputBuffer).resize(requireSize.width, undefined).toBuffer()
    var newHeight = Math.round(origSize.height / origSize.width * requireSize.width)
    finalSize = {
      width: requireSize.width,
      height: newHeight
    }
    // Upload image width less than required width, No Resize
  } else {
    var newImage = await sharp(inputBuffer).toBuffer()
    finalSize = origSize
  }

  image[imageType] = {
    filename: newName,
    size: finalSize
  }
  await willUploadObject(newName, newImage)

}

const autoCropUpload = async(inputBuffer, extension, origSize, imageType, image) => {
  let newName = generateImageName("storyV1-", extension)
  var requireSize = imageSize[imageType]
  var newImage = await sharp(inputBuffer).resize(requireSize.width, requireSize.height).crop().toBuffer()
  image[imageType] = {
    filename: newName
  }
  await willUploadObject(newName, newImage)
}

//////////////////////////////////////////////////////////////////////////////////////////
// switch (catergory) {
//     //Story image
//   case '0':
//     var images = draft.images;
//     images.push(image._id);
//     await draft.save();
//     break;
//   case '1':
//     draft.headlineImage = image._id;
//     await draft.save();
//     break;
//   case '2':
//     user.avatar = image._id;
//     break;
//   default:
//     throw new Error("illegal image upload request");
//     await user.save();
// }

// var [draft] = await Promise.all([
//   draftCheckLoginAndOwnerShip(draftID, context),
//   originalSizeUpload(buffer, extension, image)
// ]);

//export const willCustomCropUpload = async(inputBuffer, extension, imageType, image, cropAt) => {
export const willCustomCropUpload = async(imageID, cropAt, context) => {

  image[imageType] = {
    filename: newName
  }

  let newName = generateImageName("autoV1-", extension)

  var newImage = await willCustomCrop(inputBuffer)
  await willUploadObject(newName, newImage)
}

const willCustomCrop = (inputBuffer) => new Promise((resolve, reject) => {
  Jimp.read(inputBuffer).then((image) => {
    image.crop(0, 500, 1500, 500).getBuffer(Jimp.AUTO, (err, newImage) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve(newImage)
    })
  })
})

//////////////////////////////////////////////////////////////////////////////////////////
// Hold off GPS feature
// if (result.tags.GPSLatitude && result.tags.GPSLongitude) {
//   image.takenLocation = {
//     latitude: result.tags.GPSLatitude,
//     longitude: result.tags.GPSLongitude
//   }
// }
//////////////////////////////////////////////////////////////////////////////////////////
// Double check height calculation is correct
// sharp(inputBuffer).resize(requireSize.width, requireSize.height).toBuffer(function(err, data, info) {
//   //console.log(info);
// })
