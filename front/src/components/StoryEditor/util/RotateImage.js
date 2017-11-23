function rotateImage(orientation) {
  let style = {}
  switch (orientation) {
    case 2:
      style = {transform: 'rotateY(180deg)'}
      break;
    case 3:
      style = {transform: 'rotate(180deg)'}
      break;
    case 4:
      style = {transform: 'rotateX(180deg)'}
      break;
    case 5:
      style = {transform: 'rotateX(180deg) rotate(90deg)'}
      break;
    case 6:
      style = {transform: 'rotate(90deg)'}
      break;
    case 7:
      style = {transform: 'rotateY(180deg) rotate(90deg)'}
      break;
    case 8:
      style = {transform: 'rotate(-90deg)'}
      break;
    default:
      style = {}
  }
  return style
}

export default rotateImage
