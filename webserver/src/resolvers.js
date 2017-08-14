const stories = [{
  storyID: '1',
  storyName: 'My Trip in Austin I',
  snapshotContent: 'This is the snapshot of the test story a. The use case is to display the beginning text of the story',
  authorID: 'test-user-a',
  authorName: 'Test A',
  destinationID: 'test-dest-a',
  destinationName: 'Test city A',
  viewCount: 3,
  replyCout: 1,
  likeCount: 2
},{
  storyID: '2',
  storyName: 'My Trip in Austin II',
  snapshotContent: 'This is the snapshot of the test story B. The use case is to display the beginning text of the story',
  authorID: 'test-user-a',
  authorName: 'Test A',
  destinationID: 'test-dest-a',
  destinationName: 'Test city A',
  viewCount: 2,
  replyCout: 0,
  likeCount: 1
}];

let nextId = 3;

export const resolvers = {
  Query: {
    story: (root, { storyID }) => {
      return stories.find(story => story.storyID === storyID);
    },
    stories: () => {
      return stories;
    },
  },
  Mutation: {
    addStory: (root, args) => {
      const newStory = { storyID: String(nextId++), storyName: args.storyName, snapshotContent: args.snapshotContent};
      stories.push(newStory);
      return newStory;
    },
  },
};
