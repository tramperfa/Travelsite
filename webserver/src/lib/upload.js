import multer from 'multer';
import sharp from 'sharp';
import uuidv4 from 'uuid/v4';
import parser from 'exif-parser';
import passport from 'passport';

import Image from '../logic/models/image';
import Draft from '../logic/models/draft';
import {draftCheckLoginAndOwnerShip, checkLogin} from './resolverHelpers';
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

const originalSizeUpload = async(inputBuffer, extension, image) => {
  var newName = "origV1-" + uuidv4() + '.' + extension;
  var newImage = await sharp(inputBuffer).toBuffer()
  image.originalImage = {
    filename: newName
  }
  await willUploadObject(newName, newImage)

}

const widthBaseResizeUpload = async(inputBuffer, extension, origSize, imageType, image) => {
  var newName = "storyV1-" + uuidv4() + '.' + extension;
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
  var newName = "storyV1-" + uuidv4() + '.' + extension;
  var requireSize = imageSize[imageType]
  var newImage = await sharp(inputBuffer).resize(requireSize.width, requireSize.height).crop().toBuffer()
  image[imageType] = {
    filename: newName
  }
  await willUploadObject(newName, newImage)
}

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
//////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(app, db) {
  //passport.authenticate('local', {session: true}),
  app.post("/upload", upload.single('imageupload'), async(req, res) => {
    const {catergory, extension, storyID} = req.body
    const buffer = req.file.buffer
    //console.log("NON-GraphQL Requst is using sessionID :" + req.sessionID);
    const context = {
      sessionUser: req.session.passport
    }
    //console.log(req.session);

    try {
      checkLogin(context)
      var image = new Image({user: context.sessionUser.user._id, story: storyID, catergory: catergory});
      var result = parseEXIF(buffer, image)
      originalSizeUpload(buffer, extension, image)

      //Story image
      if (catergory == 0) {
        var draft = await draftCheckLoginAndOwnerShip(storyID, context)
        var images = draft.images
        images.push(image._id)
        await draft.save()
        widthBaseResizeUpload(buffer, extension, result.imageSize, 'browserStoryImage', image)
        widthBaseResizeUpload(buffer, extension, result.imageSize, 'browserCommentImage', image)
        autoCropUpload(buffer, extension, result.imageSize, 'browserCoverImage', image)
        autoCropUpload(buffer, extension, result.imageSize, 'browserUserHomeCoverImage', image)
      }
      //Headline image
      if (catergory == 1) {
        var draft = await draftCheckLoginAndOwnerShip(storyID, context)
        draft.headlineImage = image._id
        draft.save()
      }
      //
      if (catergory == 2) {
        var user = await User.findById(context.sessionUser.user._id)
        user.avatar = image._id
        user.save()
      }
      image.save()
      res.send('File uploaded to S3');
    } catch (e) {
      console.log(e);
      return res.status(400).send(e);
    } finally {}

  })

}
