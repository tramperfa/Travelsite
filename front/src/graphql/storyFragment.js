import gql from 'graphql-tag';
import {COVER_IMAGE_FRG, STORY_IMAGE_FRG, HEADLINE_IMAGE_FRG} from './imageFragment';
// import {PUBLIC_USER_SNAPSHOT_FRG} from './publicUserFragment';
// //////////////////////////////////////////////////////////////////////////////
// FRAGMENT   ...publicUserSnapshot  TB Add after Schema Stich finishes
// ${PUBLIC_USER_SNAPSHOT_FRG}
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
        fullName
      }
      headlineImage{
        ...headlineImage
      }
      coverImage{
        ...coverImage
      }
    }
    ${HEADLINE_IMAGE_FRG}
    ${COVER_IMAGE_FRG}
`;

export const STORY_IMAGE_ARRAY = gql `
      fragment storyImageArray on Story {
        _id
        images{
          ...storyImage
        }
      }
      ${STORY_IMAGE_FRG}
`;

export default STORY_CARD_FRG;
