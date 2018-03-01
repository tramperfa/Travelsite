import gql from 'graphql-tag';
import {AVATAR_FRG} from './imageFragment';

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
    ${AVATAR_FRG}
`;

export default USER_BASIC_FRG;
