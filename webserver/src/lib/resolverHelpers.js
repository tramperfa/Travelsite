import Story from '../logic/models/story'
import Draft from '../logic/models/draft'
import Image from '../logic/models/image'
import errorType from './errorType';

export const checkLogin = (context) => {
	if (!context.sessionUser || !context.sessionUser.user || !context.sessionUser.user._id) {
		//TODO Add to Error Log
		throw errorType(0)
	}
}

export const checkLoginBoolean = (context) => {
	if (context.sessionUser && context.sessionUser.user && context.sessionUser.user._id) {
		return true
	} else {
		return false
	}
}

export const willCheckDocumentOwnerShip = async (
	documentID,
	context,
	documentType
) => {
	if (!checkLoginBoolean(context)) {
		throw errorType(1)
	}
	if (!documentID || !documentType) {
		//TODO Add to Error Log
		throw errorType(3)
	}
	try {
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
			case 'leanDraft':
				var doc = await Draft.leanLoad(documentID);
				break;
			case 'image':
				var doc = await Image.findById(documentID);
				break;
			default:
				//TODO Add to Error Log
				throw errorType(3)
		}
		if (!doc || !doc.author.equals(context.sessionUser.user._id)) {
			//TODO Add to Error Log
			throw errorType(1)
		}
		return doc
	} catch (e) {
		//TODO Add to Error Log
		return e
	}

}
