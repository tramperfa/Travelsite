import multer from 'multer';
import AWS from 'aws-sdk';

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

module.exports = function(app, db) {
  app.post('/upload', upload.single('image'), (req, res) => {
    console.log("REACH SERVER!!!!!!")
    console.log(req.body)

    s3.putObject({
      Bucket: 'thetripbeyond', Key: req.file.originalname, Body: req.file.buffer, ACL: 'public-read', // your permisions
    }, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
        //return err
      }

      res.send('File uploaded to S3');
    })

  })
};
