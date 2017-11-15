import multer from 'multer';
import sharp from 'sharp';
import uuidv4 from 'uuid/v4';
import parser from 'exif-parser';

import Image from '../logic/models/image';
//import Story from '../logic/models/story';
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

const autoResizeUpload = async(inputBuffer, extension, origSize, imageType, image) => {
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

  app.post('/upload', upload.single('imageupload'), async(req, res) => {

    try {
      var image = await Image.findById(req.body.imageID)

      //Parse Out EXIF
      var result = parser.create(req.file.buffer).enableSimpleValues(false).parse()
      image.extraData = result.tags
      if (result.tags.DateTimeOriginal) {
        image.takenTime = parseDate(result.tags.DateTimeOriginal).toString();
      }

      // Upload orignal image
      await originalSizeUpload(req.file.buffer, req.body.extension, image)

      //Story image
      if (req.body.catergory == 0) {
        await widthBaseResizeUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserStoryImage', image)
        await widthBaseResizeUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserCommentImage', image)
        await autoResizeUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserCoverImage', image)
        await autoResizeUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserUserHomeCoverImage', image)
      }
      if (req.body.catergory == 1) {
        //await autoResizeUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserCoverImage', image)
      }
      //console.log(image)
      await image.save()
      res.send('File uploaded to S3');
    } catch (e) {
      console.log(e);
      return res.status(400).send(e);
    } finally {}

  })
}
