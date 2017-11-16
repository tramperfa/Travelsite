import upload from 'superagent';

function ImageUpload(file, imageCatergory, storyID) {
  const extension = file.name.split('.').pop()
  upload.post('http://localhost:8080/upload')
  //
    .attach('imageupload', file)
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

// const willUpload = async(props) => {
//
//
// }
//
//
//     //console.log("AHA" + JSON.stringify(files[0]))
//     const data = await this.props.addStoryImage(storyID)
//

// if (imageCatergory === 0) {
//   const image = await this.props.addStoryImage(imageCatergory, storyID)
// }
// if (imageCatergory === 1) {
//   const image = await this.props.addHeadlineImage(imageCatergory, storyID)
// }
// if (imageCatergory === 2) {
//   const image = await this.props.addUserImage(imageCatergory)
// }

// PreProcess
// const file = files[0]
// const storyID = this.props.match.params._id

// onDrop = async(files) => {
//
// }

// render() {
//   return (
//     <div>
//       <Dropzone onDrop={this.onDrop} accept="image/jpeg, image/gif, image/png">
//         <div>Try dropping a file here, or click to select a file to upload.</div>
//       </Dropzone>
//     </div>
//   );
// }

// }).then(() => {
//   console.log("UPLOAD FINISH");
// }).catch((error) => {
//   console.log('there was an error during fileupload', error);
// })

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
