const willExtractSize = (origImage) => new Promise((resolve, reject) => {

  const {orientation, src} = origImage
  var newImage = new Image()
  newImage.src = src

  newImage.onload = function() {
    const width = newImage.width
    const height = newImage.height

    if(4 < orientation && orientation < 9) {
      return resolve({width: height, height: width})
    } else {
      return resolve({width: width, height: height})
    }
  }
})

export default willExtractSize
