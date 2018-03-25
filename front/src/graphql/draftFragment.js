import gql from 'graphql-tag';
import {COVER_IMAGE_FRG, STORY_IMAGE_FRG} from './imageFragment';

////// FRAGMENT

export const DRAFT_CARD_FRG = gql `
    fragment draftCard on Draft {
      _id
      title
      lastUpdate
      coverImageID
      coverImage{
        ...coverImage
      }

    }
    ${COVER_IMAGE_FRG}
`;

export const DRAFT_IMAGE_ARRAY = gql `
      fragment draftImageArray on Draft {
        _id
        imageArray{
          ...storyImage
        }
      }
      ${STORY_IMAGE_FRG}
`;

export default DRAFT_CARD_FRG;
