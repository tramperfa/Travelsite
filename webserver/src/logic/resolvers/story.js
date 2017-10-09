import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'

module.exports = {
  Query: {
    story: async(parent, _id, context) => {
      //console.log(context.sessionUser);
      return Story.load(_id)
    },
    stories: async(root, options) => {
      return Story.list(options)
    },
    myDrafts: async(parent, args, context) => {
      if (context.sessionUser) {
        const options = {
          criteria: {
            'author': context.sessionUser.user._id,
            'hidden': true
          }
        }
        return Story.list(options)
      }
      return new Error('You must login to publish a story')
    }
  },

  Mutation: {
    createDraft: (parent, args, context) => {
      var newStory = new Story({title: "Unnamed Draft new", author: context.sessionUser.user._id});
      return newStory.createDraft()
    }
  },
  JSON: GraphQLJSON
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
