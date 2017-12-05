const searchImage = (imageID, imageArray) => {
	// console.log(imageID); console.log(imageArray);
	// console.log(imageArray.filter((element) => {   console.log(element);
	// console.log(element._id); console.log(element._id ===   imageID); 	return
	// element._id === imageID })); console.log(imageArray.find(element =>
	// element._id === imageID));
	return imageArray.find(element => element._id === imageID)
}

export default searchImage
