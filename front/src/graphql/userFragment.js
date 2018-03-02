import gql from 'graphql-tag';
import {AVATAR_IMAGE_FRG} from './imageFragment';

////// FRAGMENT

export const USER_BASIC_FRG = gql `
    fragment userBasic on User {
      _id
      fullName
      avatar{
        ...avatarImage
      }
      likeStory
      archiveStory
    }
    ${AVATAR_IMAGE_FRG}
`;

export default USER_BASIC_FRG;
