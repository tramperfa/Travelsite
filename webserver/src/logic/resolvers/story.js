import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'
import User from '../models/user'
import {willCheckDocumentOwnerShip, checkLogin, checkLoginBoolean} from '../../lib/resolverHelpers';
import errorType from '../../lib/errorType';

module.exports = {
	Query: {
		story: async (parent, _id, context) => {
			return Story.load({_id: _id, status: 2})
		},

		stories: async (parent, args, context) => {
			const options = {
				criteria: {
					'status': 2
				}
			}
			return Story.list(options)
		},

		userStories: async (parent, args, context) => {
			// Query Own Story
			if (checkLoginBoolean(context) && (context.sessionUser.user._id == args.userID)) {
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
			checkLogin(context)
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
		likeStory: async (parent, args, context) => {
			return willInteractStory(args.storyID, 'like', context)
		},
		archiveStory: async (parent, args, context) => {
			return willInteractStory(args.storyID, 'archive', context)
		},
		deleteStory: async (parent, args, context) => {
			return willDeleteStory(args.storyID, context)
		},
		recoverStory: async (parent, args, context) => {
			return willRecoverStory(args.storyID, context)
		}

	},
	JSON: GraphQLJSON
}

const willInteractStory = async (storyID, field, context) => {
	try {
		checkLogin(context)
		const story = await Story.findById(storyID)
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

const willDeleteStory = async (storyID, context) => {
	try {
		var story = await willCheckDocumentOwnerShip(storyID, context, 'story')
		story.status = 3
		await story.save()
		return story
	} catch (e) {
		return e
	} finally {}
}

const willRecoverStory = async (storyID, context) => {
	try {
		var story = await willCheckDocumentOwnerShip(storyID, context, 'deletedStory')
		story.status = 2
		await story.save()
		return story
	} catch (e) {
		return e
	} finally {}
}
