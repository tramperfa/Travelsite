import GraphQLJSON from 'graphql-type-json';
import Draft from '../models/draft'
import Story from '../models/story'
import User from '../models/user'
import {checkLogin, willCheckDocumentOwnerShip} from '../../lib/resolverHelpers';

module.exports = {
	Query: {
		draft: async (parent, args, context) => {
			return willCheckDocumentOwnerShip(args.draftID, context, 'draft')
		},
		myDrafts: async (parent, args, context) => {
			checkLogin(context)
			const options = {
				criteria: {
					'author': context.sessionUser.user._id,
					'status': 1
				}
			}
			return Draft.list(options)
		}
	},

	Mutation: {
		createDraft: async (parent, args, context) => {
			checkLogin(context)
			var newDraft = new Draft(
				{title: "", author: context.sessionUser.user._id, content: {}, images: []}
			);
			await newDraft.save()
			//return newDraft.newDraft()
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
				'coverImage',
				args.input.newCover,
				context
			)
		},
		updateHeadline: async (parent, args, context) => {
			return willUpdateDraft(
				args.input.draftID,
				'headlineImage',
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
	} finally {}
}

const willPublishDraft = async (draftID, context) => {
	try {

		var draft = await willCheckDocumentOwnerShip(draftID, context, 'draft')
		// Already applied for publish
		if (draft.status == 2) {
			//console.log("ENTER AAAA ");
			var story = await Story.findById(draft.story)
			if (!story.draft.equals(draft._id) || !draft.story.equals(story._id)) {
				throw new Error('Story and Draft Do Not Match')
			}
			const fields = [
				'title',
				'content',
				'poi',
				'coverImage',
				'headlineImage',
				'images'
			]
			fields.forEach(field => {
				//console.log("UPDATING FIELD " + field);
				story[field] = draft[field]
			})

			// First time applying for publish
		} else {
			//console.log("ENTER BBBB ");
			var story = new Story({
				//TESTING WITHOUT ADMIN REVIEW
				status: 2,
				draft: draft._id,
				title: draft.title,
				content: draft.content,
				author: draft.author,
				poi: draft.poi,
				coverImage: draft.coverImage,
				headlineImage: draft.headlineImage,
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
	} finally {}

}

const willDeleteDraft = async (draftID, context) => {
	try {
		var draft = await willCheckDocumentOwnerShip(draftID, context, 'draft')
		await draft.remove()
		return null
	} catch (e) {
		return e
	} finally {}

}
