import multer from 'multer';
import AWS from 'aws-sdk';
import sharp from 'sharp';
import Image from '../logic/models/Image';
import uuidv4 from 'uuid/v4';
import parser from 'exif-parser';

let aws = require('../../aws');

// Amazon s3 config
AWS.config.update(aws.s3);
const s3 = new AWS.S3();

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

const resizeCompressUpload = async(inputBuffer, extension, origSize, imageType) => {
  var newName = "bsv1" + uuidv4()
  var requireSize = imageSize[imageType]

  // do not further resize if width less than required width
  if (origSize.width > requireSize.width) {
    var newbrowserStoryImage = await sharp(inputBuffer).resize(requireSize.width, requireSize.height).toBuffer()
  } else {
    var newbrowserStoryImage = await sharp(inputBuffer).toBuffer()
  }
  await willUpload(newName + '.' + extension, newbrowserStoryImage)
}

const willUpload = (key, body) => new Promise((resolve, reject) => {
  s3.putObject({
    Bucket: 'thetripbeyond', Key: key, Body: body, ACL: 'public-read', // your permisions
  }, (err) => {
    if (err) {
      console.log(err);
      return reject(new Error(err))
    }
    return resolve("upload successful")
  })
})

module.exports = function(app, db) {

  app.post('/upload', upload.single('image'), (req, res) => {

    try {
      var result = parser.create(req.file.buffer).enableSimpleValues(false).parse()
      // console.log(result.tags.DateTimeOriginal)
      // console.log(result.tags.GPSLongitude)
      // console.log(result.tags.GPSLatitude)

      //process story image
      if (req.body.catergory == 0) {
        resizeCompressUpload(req.file.buffer, req.body.extension, result.imageSize, 'browserStoryImage')
      }
    } catch (e) {
      return res.status(400).send(e);
    } finally {}

  })

}
