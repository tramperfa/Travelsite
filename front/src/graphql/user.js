import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

////// QUERY
export const ME_QUERY = gql `
  query meQuery {
    me {
      _id
      likeStory
      archiveStory
    }
  }
`;

export const USER_DETAIL_QUERY = gql `
   query userDetailsQuery($_id : ID!) {
     user(_id: $_id) {
       _id
       fullName
       username
       provider
       profile
     }
   }
 `;

////// MUTATION

export const LOGIN_MUTATION = gql `
   mutation localLogin($input: localLoginInput!) {
     localLogin(input: $input) {
       me {
           fullName
           _id
           #avatar
       }
     }
   }
  `;

export const WithLoginMuation = graphql(LOGIN_MUTATION, {
	props: ({mutate}) => ({
		localLogin: (emailorusername, password) => mutate({
			variables: {
				input: {
					emailorusername: emailorusername,
					password: password
				}
			}
		})
	})
})

export const LOGOUT_MUTATION = gql `
  mutation logout($name: String){
    logout(fullName: $name) {
      success
    }
  }
  `;

export const REGISTER_USER_MUTATION = gql `
   mutation registerUser($input: registerUserInput!) {
     registerUser(input: $input) {
       _id
     }
   }
  `;

export default LOGIN_MUTATION
