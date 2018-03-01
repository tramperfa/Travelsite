import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {PUBLIC_USER_FRG} from './publicUserFragment';

export const PUBLIC_USER_BY_ID_QUERY = gql `
   query PublicUserByIDQuery($userID : ID!) {
     PublicUserByID(userID: $userID) {
       ...publicUser
     }
   }
   ${PUBLIC_USER_FRG}
 `;

export const withPublicUserByIDQuery = graphql(PUBLIC_USER_BY_ID_QUERY, {
	options: (props) => ({
		variables: {
			userID: props.match.params._id
		}
	}),
	name: 'userData'
})
