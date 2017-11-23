function extractSize(origImage, callback) {
  const {orientation, src} = origImage
  var newImage = new Image()
  newImage.src = src

  newImage.onload = function() {
    const width = newImage.width
    const height = newImage.height

    if(4 < orientation && orientation < 9) {
      return callback({width: height, height: width})
    } else {
      return callback({width: width, height: height})
    }
  }
}

export default extractSize
