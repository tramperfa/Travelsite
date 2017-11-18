import upload from 'superagent';

function ImageUpload(file, imageCatergory, storyID) {
  const extension = file.name.split('.').pop()
  upload.post('http://localhost:8080/upload')
  //
    .attach('imageupload', file).withCredentials()
  //
    .field('catergory', imageCatergory).field('extension', extension).field('storyID', storyID)
  //
    .end((err, res) => {
    if (err) {
      console.log(err);
    }
    alert('File uploaded!');
  })
}

export default ImageUpload

//////////////////////////////////////////////////////////////////////////////////////////
// Hold off Progress
// .on('progress', event => {
// console.log('Percentage done: ', event.percent);
// console.log('Total File Size: ', event.total);
// /* the event is:
//   {
//     direction: "upload" or "download"
//     percent: 0 to 100 // may be missing if file size is unknown
//     total: // total file size, may be missing
//     loaded: // bytes downloaded or uploaded so far
//   } */
// })
