import gql from 'graphql-tag';

////// QUERY

export const storiesListQuery = gql `
  query poularStoryQuery {
    stories {
      _id
      title
      snapshotContent
      archiveStoryCount
      likeStoryCount
      commentCount
      author{
        _id
        fullName
      }
    }
  }
`;

export const StoryDetailsQuery = gql `
  query StoryQuery($_id : ID!) {
    story(_id: $_id) {
      _id
      draft
      title
      author{
        _id
        fullName
      }
      content
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
      # comments

    }
  }
`;

export const myStoryQuery = gql `
  query myStoryQuery {
    myStories {
      _id
      title
      snapshotContent
      # Need Fragment ?
      # coverImage {
      #   _id
      #   browserCoverImage
      #   browserUserHomeCoverImage
      # }
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
    }
  }
`;

export const myDeleteStoryQuery = gql `
  query myDeleteStoryQuery {
    myDeletedStories {
      _id
      title
      snapshotContent
      # coverImage{
      #   _id
      #   browserStoryImage
      # }
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
    }
  }
`;

/////// MUTATION

export const LikeStoryMutation = gql `
  mutation likeStory($storyID : ID!) {
    likeStory(storyID: $storyID) {
      _id
      likeStoryCount
      lastUpdate
    }
  }
`;

export const ArchiveStoryMutation = gql `
  mutation archiveStory($storyID : ID!) {
    archiveStory(storyID: $storyID) {
      _id
      archiveStoryCount
      lastUpdate
    }
  }
`;

export const DeleteStoryMutation = gql `
  mutation deleteStory($storyID : ID!) {
    deleteStory(storyID: $storyID) {
      _id
      lastUpdate
    }
  }
`;

export const RecoverStoryMutation = gql `
  mutation recoverStory($storyID : ID!) {
    recoverStory(storyID: $storyID) {
      _id
      draft
      title
      author{
        _id
        fullName
      }
      content
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
    }
  }
`;

export default RecoverStoryMutation
