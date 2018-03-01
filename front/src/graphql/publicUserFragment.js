import gql from 'graphql-tag';
import {AVATAR_FRG} from './imageFragment';

////// FRAGMENT

export const PUBLIC_USER_SNAPSHOT_FRG = gql `
    fragment publicUserSnapshot on PublicUser {
      _id
      fullName
      avatar{
        ...avatarImage
      }
    }
    ${AVATAR_FRG}
`;

export const PUBLIC_USER_FRG = gql `
     fragment publicUser on PublicUser {
       ...publicUserSnapshot
       publicProfile
       following
       follower
     }
		 ${PUBLIC_USER_SNAPSHOT_FRG}
 `;

export default PUBLIC_USER_SNAPSHOT_FRG;
