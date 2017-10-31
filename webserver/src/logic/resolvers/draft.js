import GraphQLJSON from 'graphql-type-json';
import Draft from '../models/Draft'
import Story from '../models/story'
import User from '../models/user'

module.exports = {
  Query: {
    draft: async(parent, _id, context) => {
      return Draft.load(_id)
    },
    myDrafts: async(parent, args, context) => {
      if (context.sessionUser) {
        const options = {
          criteria: {
            'author': context.sessionUser.user._id
          }
        }
        return Draft.list(options)
      }
      return new Error('You must login to write a Draft')
    }
  },

  Mutation: {
    createDraft: async(parent, args, context) => {
      if (!context.sessionUser.user._id) {
        return new Error('You must login to write a draft')
      }
      var newDraft = new Draft({title: "", author: context.sessionUser.user._id});
      return newDraft.newDraft()
    },
    updateTitle: async(parent, args, context) => {
      return willUpdateDraft(args.input.draftID, 'title', args.input.newTitle, context)
    },
    updateContent: async(parent, args, context) => {
      return willUpdateDraft(args.input.draftID, 'content', args.input.newContent, context)
    },
    updateCover: async(parent, args, context) => {
      return willUpdateDraft(args.input.draftID, 'coverImage', args.input.newCover, context)
    },
    updateHeadline: async(parent, args, context) => {
      return willUpdateDraft(args.input.draftID, 'headlineImage', args.input.newHeadline, context)
    },
    publishDraft: async(parent, args, context) => {
      return willPublishDraft(args.input.draftID, context)
    }
  },
  JSON: GraphQLJSON

}

const willUpdateDraft = async(draftID, updateField, updateValue, context) => {
  try {
    if (!context.sessionUser) {
      throw new Error('User Not Logged In')
    }

    const draft = await Draft.findById(draftID)
    if (!draft || !draft.author.equals(context.sessionUser.user._id)) {
      throw new Error('Reqested draft does not exist')
    }
    draft.lastUpdate = new Date().toISOString()
    draft[updateField] = updateValue
    await draft.save()
    return draft

  } catch (e) {
    return e
  } finally {}

}

const willPublishDraft = async(draftID, context) => {
  try {
    if (!context.sessionUser) {
      throw new Error('User Not Logged In')
    }

    var draft = await Draft.findById(draftID)
    if (!draft || !draft.author.equals(context.sessionUser.user._id)) {
      throw new Error('Reqested draft does not exist')
    }
    if (draft.status == 2) {
      var story = Story.findById(draft.story)
      if (story.draft != draft._id || draft.story != story._id) {
        throw new Error('Story and Draft conflicts')
      }
      const fields = [
        title,
        content,
        poi,
        coverImage,
        headlineImage,
        images
      ]
      fields.forEach(field => {
        story[field] = draft[field]
      })
    } else {
      var newStory = new Story({
        title: draft.title,
        content: draft.content,
        author: draft.author,
        poi: draft.poi,
        coverImage: draft.coverImage,
        headlineImage: draft.headlineImage,
        images: draft.images
      })

    }

  } catch (e) {} finally {}

}
