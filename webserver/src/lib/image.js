import multer from 'multer';
import AWS from 'aws-sdk';

let config = require('./config');

// Amazon s3 config

//AWS.config.update(config.s3);
AWS.config.update({
  accessKeyId: 'AKIAI3WJWVHVQM4B7LMA', secretAccessKey: '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'
  //subregion: 'us-east-1'
});

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
  app.post('/upload', upload.single('theseNamesMustMatch'), (req, res) => {
    //console.log("REACH SERVER!!!!!!");
    s3.putObject({
      Bucket: 'thetripbeyond', Key: 'myupload.jpg', Body: req.file.buffer, ACL: 'public-read', // your permisions
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
