import gql from 'graphql-tag';
import {AVATAR_IMAGE_FRG} from './imageFragment';

////// FRAGMENT

export const USER_SOTRY_READER_FRG = gql `
    fragment userStoryReader on User {
      _id
      likeStory
      archiveStory
    }
`;

export const USER_INFO_FRG = gql `
    fragment userInfo on User {
      _id
      fullName
      publicProfile
      shippingAddress
    }
`;

export const USER_AVATAR_FRG = gql `
    fragment userAvatar on User {
      _id
      fullName
      avatar{
        ...avatarImage
      }
    }
    ${AVATAR_IMAGE_FRG}
`;

export const USER_ACCOUNT_FRG = gql `
    fragment userAccount on User {
      _id
      email
      google
      facebook
    }
`;

export default USER_SOTRY_READER_FRG;
