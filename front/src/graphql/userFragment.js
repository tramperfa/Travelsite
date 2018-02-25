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
    }
    ${AVATAR_FRG}
`;

// ${AVATAR_IMAGE_FRG}

export default USER_BASIC_FRG;
