import GraphQLJSON from 'graphql-type-json';
import Draft from '../models/draft'
import Story from '../models/story'
//import User from '../models/user'
import {willCheckDocumentOwnerShip} from '../../lib/resolverHelpers';
import errorType from '../../lib/errorType';

module.exports = {
	Query: {
		draft: async (parent, {
			draftID
		}, context) => {
			return willCheckDocumentOwnerShip(draftID, context, 'draft')
		},
		imageArrayByDraftID: async (parent, {
			draftID
		}, context) => {
			let draft = await willCheckDocumentOwnerShip(
				draftID,
				context,
				'draftImageArray'
			)
			return draft.images
		},
		myDrafts: async (parent, args, context) => {
			// USER's Own Draft
			const options = {
				criteria: {
					'authorID': context.sessionUser.user._id,
					'status': 1
				}
			}
			return Draft.list(options)
		}
	},

	Mutation: {
		createDraft: async (parent, args, context) => {
			// Create a User's Own Draft
			var newDraft = new Draft(
				{title: "", authorID: context.sessionUser.user._id, content: {}, images: []}
			);
			await newDraft.save()
			//DO NOT WIRTE: return newDraft.newDraft()  NOT WORKING
			return newDraft
		},
		updateTitle: async (parent, args, context) => {
			return willUpdateDraft(
				args.input.draftID,
				'title',
				args.input.newTitle,
				context
			)
		},
		updateContent: async (parent, args, context) => {
			return willUpdateDraft(
				args.input.draftID,
				'content',
				args.input.newContent,
				context
			)
		},
		updateCover: async (parent, args, context) => {
			return willUpdateDraft(
				args.input.draftID,
				'coverImageID',
				args.input.newCover,
				context
			)
		},
		updateHeadline: async (parent, args, context) => {
			return willUpdateDraft(
				args.input.draftID,
				'headlineImageID',
				args.input.newHeadline,
				context
			)
		},
		publishDraft: async (parent, args, context) => {
			return willPublishDraft(args.draftID, context)
		},
		deleteDraft: async (parent, args, context) => {
			return willDeleteDraft(args.draftID, context)
		}
	},
	JSON: GraphQLJSON
}

const willUpdateDraft = async (draftID, updateField, updateValue, context) => {
	try {
		var draft = await willCheckDocumentOwnerShip(draftID, context, 'draft')
		draft.lastUpdate = new Date().toISOString()
		draft[updateField] = updateValue
		await draft.save()
		return draft
	} catch (e) {
		return e
	}
}

const willPublishDraft = async (draftID, context) => {
	try {
		var draft = await willCheckDocumentOwnerShip(draftID, context, 'draft')
		// Already applied for publish
		var story;
		if (draft.status == 2) {
			story = await Story.findById(draft.story)
			if (!story.draft.equals(draft._id) || !draft.story.equals(story._id)) {
				//TODO LOG !! Story and Draft Do Not Match!
				throw errorType(2)
			}

			const fields = [
				'title',
				'content',
				'poi',
				'coverImageID',
				'headlineImageID',
				'images'
			]
			fields.forEach(field => {
				story[field] = draft[field]
			})
			// First time applying for publish
		} else {
			story = new Story({
				//TESTING WITHOUT ADMIN REVIEW
				status: 2,
				draft: draft._id,
				title: draft.title,
				content: draft.content,
				authorID: draft.authorID,
				poi: draft.poi,
				coverImageID: draft.coverImageID,
				headlineImageID: draft.headlineImageID,
				images: draft.images
			})
			draft.story = story._id
			story.draft = draft._id
			draft.status = 2
			await draft.save()
		}
		await story.save()
		return draft
	} catch (e) {
		return e
	}

}

const willDeleteDraft = async (draftID, context) => {
	try {
		var draft = await willCheckDocumentOwnerShip(draftID, context, 'draft')
		await draft.remove()
		return null
	} catch (e) {
		return e
	}
}
