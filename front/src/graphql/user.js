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

export const WithMeQuery = graphql(ME_QUERY, {
	options: {},
	name: 'MeData'
})

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

export const withUserDetailQuery = graphql(USER_DETAIL_QUERY, {
	options: (props) => ({
		variables: {
			_id: props.match.params._id
		}
	}),
	name: 'userData'
})

////// MUTATION

export const LOGIN_MUTATION = gql `
   mutation localLogin($input: localLoginInput!) {
     localLogin(input: $input) {
       me {
           fullName
           _id
           #likeStory
           #archiveStory
           #avatar
       }
     }
   }
  `;

export const WithLoginMutation = graphql(LOGIN_MUTATION, {
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

export const WithLogoutMutation = graphql(LOGOUT_MUTATION, {
	props: ({mutate}) => ({
		logout: () => mutate()
	})
})

export const REGISTER_USER_MUTATION = gql `
   mutation registerUser($input: registerUserInput!) {
     registerUser(input: $input) {
       _id
     }
   }
  `;

export const WithRegisterUserMutation = graphql(REGISTER_USER_MUTATION, {
	props: ({mutate}) => ({
		registerUser: (username, displayname, email, password) => mutate({
			variables: {
				input: {
					username: username,
					fullName: displayname,
					email: email,
					password: password
				}
			}
		})
	})
})

export default LOGIN_MUTATION
