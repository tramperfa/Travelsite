import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'
import User from '../models/user'
import {willCheckDocumentOwnerShip, checkLoginBoolean} from '../../lib/resolverHelpers';
import errorType from '../../lib/errorType';

module.exports = {
	Query: {
		story: async (parent, {
			_id
		}, context) => {
			return Story.load({_id: _id, status: 2})
		},
		stories: async (parent, args, context, info) => {
			//console.log("Stories List Query Executed");
			const options = {
				criteria: {
					'status': 2
				}

			}
			return Story.list(options)
		},

		userStories: async (parent, {
			userID
		}, context) => {
			// Query User's Own Story
			if (checkLoginBoolean(context) && (context.sessionUser.user._id == userID)) {
				const options = {
					criteria: {
						'author': context.sessionUser.user._id,
						'status': {
							$lt: 3
						}
					}
				}
				return Story.list(options)
				// Query Someone Else Story
			} else {
				const options = {
					criteria: {
						'author': args.userID,
						'status': 2
					}
				}
				return Story.list(options)
			}

		},

		DeletedStories: async (parent, args, context) => {
			//User's Own Deleted Stories
			const options = {
				criteria: {
					'author': context.sessionUser.user._id,
					'status': 3
				}
			}
			return Story.list(options)
		}
	},

	Mutation: {
		likeStory: async (parent, {
			storyID
		}, context) => {
			return willInteractStory(storyID, 'like', context)
		},
		archiveStory: async (parent, {
			storyID
		}, context) => {
			return willInteractStory(storyID, 'archive', context)
		},
		deleteStory: async (parent, {
			storyID
		}, context) => {
			return willUpdateStoryStatus(storyID, context, 3)
		},
		recoverStory: async (parent, {
			storyID
		}, context) => {
			return willUpdateStoryStatus(storyID, context, 2)
		}

	},
	JSON: GraphQLJSON
}

const willInteractStory = async (storyID, field, context) => {
	try {
		var story = await willCheckDocumentOwnerShip(storyID, context, 'story')
		if (!story || story.status != 2) {
			throw errorType(4)
		}
		const interactField = field + 'Story'
		const user = await User.findById(context.sessionUser.user._id)
		if (user[interactField].indexOf(story._id) >= 0) {
			throw new Error('You already ' + field + ' the story')
		}
		const countField = interactField + 'Count'
		story[countField] = story[countField] + 1

		story[interactField].push(story._id)
		user[interactField].push(story._id)

		await user.save()
		await story.save()
		return story
	} catch (e) {
		return e
	}
}

const willUpdateStoryStatus = async (storyID, context, newStatus) => {
	try {
		var story = await willCheckDocumentOwnerShip(storyID, context, 'story')
		story.status = newStatus
		await story.save()
		return story
	} catch (e) {
		return e
	}
}

// const willDeleteStory = async (storyID, context) => { 	try { 		var story =
// await willCheckDocumentOwnerShip(storyID, context, 'story') 		story.status =
// 3 		await story.save() 		return story 	} catch (e) { 		return e 	} }
//
// const willRecoverStory = async (storyID, context) => { 	try { 		var story =
// await willCheckDocumentOwnerShip(storyID, context, 'story') 		story.status =
// 2 		await story.save() 		return story 	} catch (e) { 		return e 	} }