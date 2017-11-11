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
    width: 700,
    height: undefined
  }
}

const parseDate = (s) => {
  var b = s.split(/\D/);
  return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

const originalImageUpload = async(inputBuffer, extension, ImageInfoDB) => {
  var newName = "bsv1" + uuidv4()
  var newbrowserStoryImage = await sharp(inputBuffer).toBuffer()
  await willUploadObject(newName + '.' + extension, newbrowserStoryImage)
}

const resizeCompressUpload = async(inputBuffer, extension, origSize, imageType, ImageInfoDB) => {
  var newName = "bsv1" + uuidv4()
  var requireSize = imageSize[imageType]
  ImageInfoDB[imageType].filename = newName + '.' + extension;

  // Resize to match required width
  if (origSize.width > requireSize.width) {
    var newbrowserStoryImage = await sharp(inputBuffer).resize(requireSize.width, requireSize.height).toBuffer()
    var newHeight = Math.round(origSize.height / origSize.width * requireSize.width)

    sharp(inputBuffer).resize(requireSize.width, requireSize.height).toBuffer(function(err, data, info) {
      console.log(info);
    })
    var finalHeight = requireSize.height
      ? requireSize.height
      : newHeight

    // ImageInfoDB[imageType] = {
    //   width: requireSize.width,
    //   height: finalHeight
    // }

  } else {
    var newbrowserStoryImage = await sharp(inputBuffer).toBuffer()
    // ImageInfoDB[imageType] = {
    //   width: origSize.width,
    //   height: origSize.height
    // }
  }

  await willUploadObject(newName + '.' + extension, newbrowserStoryImage)

}

module.exports = function(app, db) {

  app.post('/upload', upload.single('imageupload'), async(req, res) => {

    try {
      var result = parser.create(req.file.buffer).enableSimpleValues(false).parse()
      var ImageInfoDB = await Image.findById(req.body.imageID)
      ImageInfoDB.extraData = result.tags
      if (result.tags.DateTimeOriginal) {
        ImageInfoDB.takenTime = parseDate(result.tags.DateTimeOriginal).toString();
      }

      //Story image
      if (req.body.catergory == 0) {
        await resizeCompressUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserStoryImage', ImageInfoDB)
      }
      //console.log(ImageInfoDB)
      await ImageInfoDB.save()

      res.send('File uploaded to S3');
    } catch (e) {
      console.log(e);
      return res.status(400).send(e);
    } finally {}

  })

}
//////////////////////////////////////////////////////////////////////////////////////////
// Hold off on GPS feature
// if (result.tags.GPSLatitude && result.tags.GPSLongitude) {
//   ImageInfoDB.takenLocation = {
//     latitude: result.tags.GPSLatitude,
//     longitude: result.tags.GPSLongitude
//   }
// }
