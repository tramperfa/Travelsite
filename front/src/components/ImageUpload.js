import upload from 'superagent';

const willUploadImage = (file, imageCatergory, storyID) => new Promise((resolve, reject) => {
  const extension = file.name.split('.').pop()
  upload.post('http://localhost:8080/upload')
  //
    .attach('imageupload', file).withCredentials()
  //
    .field('catergory', imageCatergory).field('extension', extension).field('storyID', storyID)
  //
    .end((err, res) => {
    if (err) {
      return reject(new Error(err))
    }
    console.log("Returned Image Object: ");
    console.log(res.body);
    return resolve(res.body)
    //alert('File uploaded!');
  })
})

export default willUploadImage

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
