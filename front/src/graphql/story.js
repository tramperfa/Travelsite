import gql from 'graphql-tag';
import {STORY_CARD_FRG, STORY_IMAGE_ARRAY} from './storyFragment';

////// QUERY

export const STORY_DETAILS_QUERY = gql `
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

export const STORIES_LIST_QUERY = gql `
  query poularStoryQuery {
    stories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const MY_STORY_QUERY = gql `
  query myStoryQuery {
    myStories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const MY_DELETE_STORY_QUERY = gql `
  query myDeleteStoryQuery {
    myDeletedStories {
      ...storyCard
    }
  }
${STORY_CARD_FRG}
`;

/////// MUTATION

export const LIKE_STORY_MUTATION = gql `
  mutation likeStory($storyID : ID!) {
    likeStory(storyID: $storyID) {
      _id
      likeStoryCount
      lastUpdate
    }
  }
`;

export const ARCHIVE_STORY_MUTATION = gql `
  mutation archiveStory($storyID : ID!) {
    archiveStory(storyID: $storyID) {
      _id
      archiveStoryCount
      lastUpdate
    }
  }
`;

export const DELETE_STORY_MUTATION = gql `
  mutation deleteStory($storyID : ID!) {
    deleteStory(storyID: $storyID) {
      _id
      lastUpdate
    }
  }
`;

export const RECOVER_STORY_MUTATION = gql `
  mutation recoverStory($storyID : ID!) {
    recoverStory(storyID: $storyID) {
      _id
    }
  }
`;

export default RECOVER_STORY_MUTATION
