import multer from 'multer';
import sharp from 'sharp';
import uuidv4 from 'uuid/v4';
import parser from 'exif-parser';
import passport from 'passport';
//import Jimp from 'jimp';

import Image from '../logic/models/image';
import Draft from '../logic/models/draft';
import {willCheckDocumentOwnerShip, checkLogin} from './resolverHelpers';
import {willUploadObject, willDeleteObject} from './S3';

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
      var image = new Image({author: context.sessionUser.user._id, draft: draftID, catergory: catergory});
      const buffer = await sharp(req.file.buffer).rotate().toBuffer()
      // Get The Right Size After Taking Orientation Through .rotate()
      var imageSize = parseSize(buffer, image)
      // Add EXIF
      var result = parseEXIF(req.file.buffer, image, imageSize)

      switch (catergory) {
          // Story Image
        case '0':
          var [draft] = await Promise.all([
            willCheckDocumentOwnerShip(draftID, context, 'draft'),
            originalSizeUpload(buffer, extension, imageSize, image),
            widthBasedResizeUpload(buffer, extension, imageSize, 'browserStoryImage', image),
            widthBasedResizeUpload(buffer, extension, imageSize, 'browserCommentImage', image),
            autoCropUpload(buffer, extension, 'browserCoverImage', image),
            autoCropUpload(buffer, extension, 'browserUserHomeCoverImage', image)
          ]);
          break;
          // Headline Image, Avatar Image
        case '1':
        case '2':
          await originalSizeUpload(buffer, extension, imageSize, image);
          break;
        default:
          throw new Error("illegal image upload request")
      }
      // Save Image Before Draft
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

const parseEXIF = (buffer, image, imageSize) => {
  //Parse Out EXIF With Processed ImageSize
  var result = parser.create(buffer).enableSimpleValues(false).parse()
  result.imageSize = imageSize
  image.extraData = result.tags
  if (result.tags.DateTimeOriginal) {
    image.takenTime = parseDate(result.tags.DateTimeOriginal).toString();
  }
  return result
}

const parseSize = (buffer, image) => {
  var result = parser.create(buffer).enableImageSize(true).parse()
  return result.getImageSize()
}

const generateImageName = (prefix, extension) => {
  return prefix + uuidv4() + '.' + extension
}

const originalSizeUpload = async(inputBuffer, extension, origSize, image) => {
  let newName = generateImageName("origV1-", extension)
  image.originalImage = {
    filename: newName,
    size: origSize
  }
  await willUploadObject(newName, inputBuffer)
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
    var newImage = inputBuffer
    finalSize = origSize
  }

  image[imageType] = {
    filename: newName,
    size: finalSize
  }
  await willUploadObject(newName, newImage)

}

const autoCropUpload = async(inputBuffer, extension, imageType, image) => {
  let newName = generateImageName("autoV1-", extension)
  var requireSize = imageSize[imageType]
  // If Image Original Size is Smaller, First Enlarge to Match Require Size
  // Otherwise, "Hole" will be left at required size
  var newImage = await sharp(inputBuffer).resize(requireSize.width, requireSize.height).crop().toBuffer()

  image[imageType] = {
    filename: newName,
    size: requireSize
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
// sharp(inputBuffer).rotate().resize(requireSize.width, requireSize.height).toBuffer(function(err, data, info) {
//   //console.log(info);
// })
