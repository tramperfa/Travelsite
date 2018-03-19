import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'
import User from '../models/user'
import {willCheckDocumentOwnerShip, checkLoginBoolean} from '../../lib/resolverHelpers';
import errorType from '../../lib/errorType';
import uuidv4 from 'uuid/v4';

module.exports = {
	Query: {
		story: async (parent, {_id}) => {
			return Story.load({_id: _id, status: 2})
		},
		stories: async () => {
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
						'author': userID,
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
		},
		commentStory: async (parent, args, context) => {
			return willAddComment(
				context.sessionUser.user._id,
				args.input.storyID,
				args.input.content,
				args.input.quoteImage,
				args.input.imageID,
				context
			)
		},
		replyStory: async (parent, args, context) => {
			return willAddReply(
				args.input.storyID,
				args.input.content,
				args.input.replytoID,
				context,
			)
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

const willAddComment = async (
	userID,
	storyID,
	content,
	quoteImage,
	imageID,
	context
) => {
	try {
		let story = await willCheckDocumentOwnerShip(storyID, context, 'story')
		let imageQuote = quoteImage
			? imageID
			: undefined

		let newComment = {
			_id: uuidv4(),
			author: userID,
			storyID: storyID,
			content: content,
			quoteImage: imageQuote,
			isReply: false,
			publishTime: new Date()
		}
		story.commentReply.push(newComment)
		await story.save()
		return newComment
	} catch (e) {
		return e
	}
}

const willAddReply = async (storyID, content, replytoID, context) => {
	try {
		let story = await willCheckDocumentOwnerShip(storyID, context, 'story')

		//check if replying comment exist
		var replytoComment
		story.commentReply.map(comment => {
			if (comment._id === replytoID) {
				replytoComment = comment
			}
		})

		if (!replytoComment) {
			throw new Error('Reply to non-exist comments')
		} else {
			let author = await User.load(context.sessionUser.user._id)
			let newReply = {
				_id: uuidv4(),
				author: author._id,
				storyID: storyID,
				content: content,
				isReply: true,
				publishTime: new Date(),
				replyTo: {
					_id: replytoComment._id,
					authorName: author.fullName,
					content: replytoComment.content,
					publishTime: replytoComment.publishTime
				}
			}
			story.commentReply.push(newReply)
			await story.save()
			return newReply
		}
	} catch (e) {
		return e
	}
}
