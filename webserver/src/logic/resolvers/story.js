import GraphQLJSON from 'graphql-type-json';
import Story from '../models/story'


module.exports = {
  Query: {
    story: (parent, _id, context) => {
      console.log(context);
      console.log("passport.sessionUser: " + context.passport);
      //console.log(context.passport);

      return Story.load(_id)
    },
    stories: (root, options) => {
      return Story.list(options)
    },
  },
  Mutation: {
    createDraft: (parent, args, context) => {
      var newStory = new Story({
        title: "Unnamed Draft new",
        user: args.input.user_id
      });
      return newStory.createDraft()
    },
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
