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
			var doc = await Story.load({
				_id: documentID,
				'status': {
					$lt: 3
				}
			});
			break;
		case 'deletedStory':
			var doc = await Story.load({_id: documentID, 'status': 3});
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
