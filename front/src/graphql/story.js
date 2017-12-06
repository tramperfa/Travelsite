import gql from 'graphql-tag';
import {STORY_CARD_FRG, STORY_IMAGE_ARRAY} from './storyFragment';

////// QUERY

export const StoryDetailsQuery = gql `
  query StoryQuery($_id : ID!) {
    story(_id: $_id) {
      ...storyCard
      content
      ...storyImageArray
    }
  }
  ${STORY_CARD_FRG}
  ${STORY_IMAGE_ARRAY}
`;

export const storiesListQuery = gql `
  query poularStoryQuery {
    stories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const myStoryQuery = gql `
  query myStoryQuery {
    myStories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const myDeleteStoryQuery = gql `
  query myDeleteStoryQuery {
    myDeletedStories {
      ...storyCard
    }
  }
${STORY_CARD_FRG}
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
    }
  }
`;

export default RecoverStoryMutation
