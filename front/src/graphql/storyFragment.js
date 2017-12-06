import gql from 'graphql-tag';
import {COVER_IMAGE_FRG, STORY_IMAGE_FRG} from './imageFragment';
import {USER_BASIC_FRG} from './userFragment';

////// FRAGMENT

export const STORY_CARD_FRG = gql `
    fragment storyCard on Story {
      _id
      title
      lastUpdate
      snapshotContent
      archiveStoryCount
      likeStoryCount
      commentCount
      author{
        ...userBasic
      }
      coverImage{
        ...coverImage
      }
    }
    ${USER_BASIC_FRG}
    ${COVER_IMAGE_FRG}
`;

export const STORY_IMAGE_ARRAY = gql `
      fragment storyImageArray on Story {
        images{
          ...storyImage
        }
      }
      ${STORY_IMAGE_FRG}
`;

export default STORY_CARD_FRG;
