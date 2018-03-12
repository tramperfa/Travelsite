import Story from '../logic/models/story'
import Draft from '../logic/models/draft'
import Image from '../logic/models/image'
//import User from '../logic/models/user'
import errorType from './errorType';

// export const checkLogin = (context) => { 	if (!context.sessionUser ||
// !context.sessionUser.user || !context.sessionUser.user._id) {
// 	 TODO Add to Error Log 		throw errorType(0) 	} }

export const checkLoginBoolean = (context) => {
	if (context.sessionUser && context.sessionUser.user && context.sessionUser.user._id) {
		return true
	} else {
		return false
	}
}

export const requireOwnerCheck = (context) => {
	if (context.authAdd && context.authAdd.checkOwner) {
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
	if (!documentID) {
		//TODO Add to Error Log
		console.log("No Document ID Found");
		throw errorType(3)
	}
	try {
		var doc = null
		const check = requireOwnerCheck(context)
		switch (documentType) {
			case 'story':
				doc = await Story.load({_id: documentID});
				break;
			case 'draft':
				doc = await Draft.load(documentID);
				break;
			case 'leanDraft':
				doc = await Draft.leanLoad(documentID);
				break;
			case 'image':
				doc = await Image.findById(documentID);
				break;
			default:
				//TODO Add to Error Log
				console.log("No Document TYPE Found");
				throw errorType(3)
		}
		if (!doc) {
			throw errorType(4)
		}
		if (check) {
			console.log(" Checking Document Ownership");
			//console.log(context.req.body);
			if (!doc.author.equals(context.sessionUser.user._id)) {
				//TODO Add to Error Log REVIEW False Claim as Document Owner
				throw errorType(4)
			}
		}
		return doc
	} catch (e) {
		//TODO Add to Error Log
		return e
	}
}
