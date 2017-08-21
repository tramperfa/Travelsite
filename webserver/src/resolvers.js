import GraphQLJSON from 'graphql-type-json';
import mongoose from 'mongoose';
import Story from './models/story.js'
mongoose.connect('mongodb://mongodb:27017/my_database', { useMongoClient: true, config: { autoIndex: false } });
mongoose.Promise = global.Promise; // USE ES6 native promises, since Mongoose promise is depreciated.


// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Mongoose connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log('Mongoose connected to MongoDB!');
// });
const Content = {
  "entityMap": {},
  "blocks": [
    {
      "key": "fcv05",
      "text": "dafoihg",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    },
    {
      "key": "iulj",
      "text": "dafhiuahg",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ]
};
const localStoryList = [{
  _id: '1',
  title: 'My Trip in Austin I',
  snapshotContent: 'This is the snapshot of the test story a. The use case is to display the beginning text of the story',
  authorID: 'test-user-a',
  authorName: 'Test A',
  destinationID: 'test-dest-a',
  destinationName: 'Test city A',
  viewCount: 3,
  likeCount: 2,
  content: Content
  },{
  _id: '2',
  title: 'My Trip in Austin II',
  snapshotContent: 'This is the snapshot of the test story B. The use case is to display the beginning text of the story',
  authorID: 'test-user-a',
  authorName: 'Test A',
  destinationID: 'test-dest-a',
  destinationName: 'Test city A',
  viewCount: 2,
  likeCount: 1,
  content: Content
}];




export const resolvers = {
  Query: {
    story: (root, { _id }) => {
      return new Promise((resolve, reject) => {
        Story.findOne({ _id: _id }).exec((err, res) => {
          err ? reject(err) : resolve(res);
        })
      });
      //stories.find(story => story._id === _id);
    },
    stories: (root, options) => {
      //return localStoryList  // LOCAL version

      // Second version: local DB function call
      // return new Promise((resolve, reject) => {
      //   Story.find({}).exec((err, res) => {
      //     err ? reject(err) : resolve(res);
      //   })
      // });

      return Story.list(options)
    },
  },
  Mutation: {
    createStory: (root, args) => {
      const newStory = new Story({
        title: "Unnamed Draft",
        user: args.user_id
      });
      newStory.save(function (err, newStory) {
        if (err) return console.error(err);
        return newStory
      });
    },
  },
  JSON: GraphQLJSON
};
