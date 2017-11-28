import Story from '../logic/models/story'
import Draft from '../logic/models/draft'
import Image from '../logic/models/image'

export const checkLogin = (context) => {
	if (!context.sessionUser) {
		return new Error('User Not Logged In')
	}
}

export const willCheckDocumentOwnerShip = async (
	documentID,
	context,
	documentType
) => {
	checkLogin(context)
	switch (documentType) {
		case 'story':
			var doc = await Story.findById(documentID);
			break;
		case 'draft':
			var doc = await Draft.load(documentID);
			break;
		case 'image':
			var doc = await Image.findById(documentID);
			break;
		default:
			return null;
	}
	if (!doc || !doc.author.equals(context.sessionUser.user._id)) {
		console.log('Reqested ' + documentType + ' does not exist')
	}
	return doc
}

// ///////////////////////////////////////////////////////////////////// ///////
// export const storyCheckLoginAndOwnerShip = async(storyID, context)
// => {   if (!context.sessionUser) {     return new Error('User Not Logged In')
// }   var story = await Story.findById(storyID)
//
// if (!story || !story.author.equals(context.sessionUser.user._id)) { return
// new Error('Reqested story does not exist')   }   return story }
//
// export const draftCheckLoginAndOwnerShip = async(draftID, context) => {   if
// (!context.sessionUser) {     return new Error('User Not Logged In')   }   var
// draft = await Draft.load(draftID)   if (!draft ||
// !draft.author.equals(context.sessionUser.user._id)) {     return new
// Error('Reqested draft does not exist')   }   return draft }