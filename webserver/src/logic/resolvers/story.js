import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'
import User from '../models/user'

module.exports = {
  Query: {
    story: async(parent, _id, context) => {
      return Story.load(_id)
    },
    stories: async(parent, args, context) => {
      const options = {
        criteria: {
          'hidden': false,
          'adminDelete': false
        }
      }
      return Story.list(options)
    },
    myDrafts: async(parent, args, context) => {
      if (context.sessionUser) {
        const options = {
          criteria: {
            'author': context.sessionUser.user._id,
            'hidden': true,
            'adminDelete': false
          }
        }
        return Story.list(options)
      }
      return new Error('You must login to write a story')
    }
  },
  Mutation: {
    createDraft: async(parent, args, context) => {
      var newStory = new Story({title: "", author: context.sessionUser.user._id});
      return newStory.newDraft()
    },
    updateTitle: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'title', args.input.newTitle, context)
    },
    updateContent: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'content', args.input.newContent, context)
    },
    updateCover: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'coverImage', args.input.newCover, context)
    },
    updateHeadline: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'headlineImage', args.input.newHeadline, context)
    },
    publishStory: async(parent, args, context) => {
      return willUpdateDraft(args.storyID, 'hidden', false, context)
    },

    likeStory: async(parent, args, context) => {
      return willInteractStory(args.storyID, 'like', context)
    },
    archiveStory: async(parent, args, context) => {
      return willInteractStory(args.storyID, 'archive', context)
    }

  },
  JSON: GraphQLJSON
}

const willUpdateDraft = async(storyID, updateField, updateValue, context) => {
  try {
    if (!context.sessionUser) {
      throw new Error('User Not Logged In')
    }

    const story = await Story.findById(storyID)
    if (!story || story.adminDelete || !story.author.equals(context.sessionUser.user._id)) {
      throw new Error('Reqested draft does not exist')
    }
    story.lastUpdate = new Date().toISOString()
    story[updateField] = updateValue
    await story.save()
    return story

  } catch (e) {
    return e
  } finally {}

}

const willInteractStory = async(storyID, interactField, context) => {
  try {
    if (!context.sessionUser) {
      throw new Error('User Not Logged In')
    }
    const story = await Story.findById(storyID)
    if (!story || story.adminDelete) {
      throw new Error('Reqested story does not exist')
    }
    const user = await User.findById(context.sessionUser.user._id)
    if (user[interactField].indexOf(story._id) >= 0) {
      throw new Error('You already ' + JSON.stringify(interactField) + ' the story')
    }
    const countField = interactField + 'Count'
    //console.log("COUNT FIELD : " + countField)
    story[countField] = story[countField] + 1
    story[interactField].push(story._id)
    user[interactField].push(story._id)
    //console.log("NEW USER FIELD" + JSON.stringify(user[interactField]));
    await user.save()
    await story.save()
    return story
  } catch (e) {
    return e
  } finally {}
}
