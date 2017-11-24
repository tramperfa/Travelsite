function redrawImage(src, orientation, callback) {
  if (orientation == 1 || orientation == -1) {
    return callback(src)
  }

  var newImage = new Image()
  newImage.src = src

  newImage.onload = function() {
    var width = newImage.width
    var height = newImage.height
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext("2d")

    if(4 < orientation && orientation < 9) {
      canvas.width = height
      canvas.height = width
    } else {
      canvas.width  = width
      canvas.height = height
    }

    switch (orientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height , width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: break;
    }

    ctx.drawImage(newImage, 0, 0);

    callback(canvas.toDataURL());
  }
}

export default redrawImage
