const searchImage = (imageID, imageArray) => {
  console.log(imageArray);
  return imageArray.find(element => element._id  === imageID)
}

export default searchImage
