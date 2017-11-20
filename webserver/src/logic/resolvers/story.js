import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'
import User from '../models/user'
import {willCheckDocumentOwnerShip} from '../../lib/resolverHelpers';

module.exports = {
  Query: {
    story: async(parent, _id, context) => {
      return Story.load(_id)
    },

    stories: async(parent, args, context) => {
      const options = {
        criteria: {
          'status': 2
        }
      }
      return Story.list(options)
    },

    myStories: async(parent, args, context) => {
      if (context.sessionUser) {
        const options = {
          criteria: {
            'author': context.sessionUser.user._id,
            'status': {
              $lt: 3
            }
          }
        }
        return Story.list(options)
      }
      return new Error('You must login')
    },

    myDeletedStories: async(parent, args, context) => {
      if (context.sessionUser) {
        const options = {
          criteria: {
            'author': context.sessionUser.user._id,
            'status': 3
          }
        }
        return Story.list(options)
      }
      return new Error('You must login')
    }
  },

  Mutation: {
    likeStory: async(parent, args, context) => {
      return willInteractStory(args.storyID, 'like', context)
    },
    archiveStory: async(parent, args, context) => {
      return willInteractStory(args.storyID, 'archive', context)
    },
    deleteStory: async(parent, args, context) => {
      return willDeleteStory(args.storyID, context)
    },
    recoverStory: async(parent, args, context) => {
      return willRecoverStory(args.storyID, context)
    }

  },
  JSON: GraphQLJSON
}

const willInteractStory = async(storyID, field, context) => {
  try {
    if (!context.sessionUser) {
      throw new Error('User Not Logged In')
    }
    const story = await Story.findById(storyID)
    if (!story || story.status != 2) {
      throw new Error('Reqested story does not exist')
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
  } finally {}
}

const willDeleteStory = async(storyID, context) => {
  try {
    var story = await willCheckDocumentOwnerShip(storyID, context, 'story')
    story.status = 3
    await story.save()
    return story
  } catch (e) {
    return e
  } finally {}
}

const willRecoverStory = async(storyID, context) => {
  try {
    var story = await willCheckDocumentOwnerShip(storyID, context, 'story')
    console.log(story);
    story.status = 2
    await story.save()
    return story
  } catch (e) {
    return e
  } finally {}
}
