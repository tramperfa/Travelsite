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
      var newStory = new Story({title: "Unnamed Draft new", author: context.sessionUser.user._id});
      return newStory.newDraft()
    },
    updateTitle: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'title', args.input.newTitle, true, context)
    },
    updateContent: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'content', args.input.newContent, true, context)
    },
    updateCover: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'coverImage', args.input.newCover, true, context)
    },
    updateHeadline: async(parent, args, context) => {
      return willUpdateDraft(args.input.storyID, 'headlineImage', args.input.newHeadline, true, context)
    },
    publishStory: async(parent, args, context) => {
      return willUpdateDraft(args.storyID, 'hidden', false, false, context)
    },
    likeStory: async(parent, args, context) => {
      await willUpdateDraft(args.storyID, 'likeCount', 1, false, context)
      return willUpdateDraft(args.storyID, 'like', 0, false, context)
    },
    archiveStory: async(parent, args, context) => {
      await willUpdateDraft(args.storyID, 'archiveCount', 1, false, context)
      return willUpdateDraft(args.storyID, 'archive', 0, false, context)
    }

  },
  JSON: GraphQLJSON
}

const willUpdateDraft = async(storyID, updateField, updateValue, ownerEnforce, context) => {
  try {
    if (!context.sessionUser) {
      throw new Error('User Not Logged In')
    }

    const story = await Story.findById(storyID)
    if (!story || story.adminDelete) {
      throw new Error('Reqested story does not exist')
    }
    if (ownerEnforce) {
      if (!story.author.equals(context.sessionUser.user._id)) {
        throw new Error('Reqested story edit is not authorized')
      }
      story.lastUpdate = new Date().toISOString()
    }

    if (updateField == 'likeCount' || updateField == 'archiveCount') {
      story[updateField] = story[updateField] + 1
    } else if (updateField == 'like' || updateField == 'archive') {
      const user = await User.findById(context.sessionUser.user._id)
      if (user[updateField].includes(storyID)) {
        throw new Error('You have already ' + {
          updateField
        } + 'd the story')
      }
      story[updateField].push()
      user[updateField].push()
      await user.save()

    } else {
      story[updateField] = updateValue
    }
    await story.save()
    return story

  } catch (e) {
    return e
  } finally {}

}

// const Content = {
//   "entityMap": {},
//   "blocks": [
//     {
//       "key": "fcv05",
//       "text": "dafoihg",
//       "type": "unstyled",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [],
//       "data": {}
//     },
//     {
//       "key": "iulj",
//       "text": "dafhiuahg",
//       "type": "unstyled",
//       "depth": 0,
//       "inlineStyleRanges": [],
//       "entityRanges": [],
//       "data": {}
//     }
//   ]
// };
// const localStoryList = [{
//   _id: '1',
//   title: 'My Trip in Austin I',
//   snapshotContent: 'This is the snapshot of the test story a. The use case is to display the beginning text of the story',
//   authorID: 'test-user-a',
//   authorName: 'Test A',
//   destinationID: 'test-dest-a',
//   destinationName: 'Test city A',
//   viewCount: 3,
//   likeCount: 2,
//   content: Content
//   },{
//   _id: '2',
//   title: 'My Trip in Austin II',
//   snapshotContent: 'This is the snapshot of the test story B. The use case is to display the beginning text of the story',
//   authorID: 'test-user-a',
//   authorName: 'Test A',
//   destinationID: 'test-dest-a',
//   destinationName: 'Test city A',
//   viewCount: 2,
//   likeCount: 1,
//   content: Content
// }];
