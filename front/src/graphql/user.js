import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

import {USER_SOTRY_READER_FRG, USER_INFO_FRG, USER_ACCOUNT_FRG, USER_AVATAR_FRG} from './userFragment';

////// QUERY
export const USER_SELF_STORY_READER_QUERY = gql `
  query UserSelfQuery($userID : String) {
    userSelf(userID: $userID){
      ...userStoryReader
    }
  }
  ${USER_SOTRY_READER_FRG}
`;

export const WithUserSelfStoryReaderQuery = graphql(
	USER_SELF_STORY_READER_QUERY,
	{
		options: (props) => ({
			variables: {
				userID: "MYSELF"
			}
		}),
		name: 'MeData'
	}
)

export const USER_SELF_INFO_QUERY = gql `
  query UserSelfQuery($userID : String) {
    userSelf(userID: $userID){
      ...userInfo
    }
  }
  ${USER_INFO_FRG}
`;

export const WithUserSelfInfoQuery = graphql(USER_SELF_INFO_QUERY, {
	options: (props) => ({
		variables: {
			userID: "MYSELF"
		}
	}),
	name: 'MeData'
})

export const USER_SELF_AVATAR_QUERY = gql `
  query UserSelfQuery($userID : String) {
    userSelf(userID: $userID){
      ...userAvatar
    }
  }
  ${USER_AVATAR_FRG}
`;

export const WithUserSelfAvatarQuery = graphql(USER_SELF_AVATAR_QUERY, {
	options: (props) => ({
		variables: {
			userID: "MYSELF"
		}
	}),
	name: 'MeData'
})

export const USER_SELF_ACCOUNT_QUERY = gql `
  query UserSelfQuery($userID : String) {
    userSelf(userID: $userID){
      ...userAccount
    }
  }
  ${USER_ACCOUNT_FRG}
`;

export const WithUserSelfAccoutQuery = graphql(USER_SELF_ACCOUNT_QUERY, {
	options: (props) => ({
		variables: {
			userID: "MYSELF"
		}
	}),
	name: 'MeData'
})

////// MUTATION

export const LOGIN_MUTATION = gql `
   mutation localLogin($input: localLoginInput!) {
     localLogin(input: $input) {
       me {
           fullName
           _id
           role
       }
     }
   }
  `;

export const WithLoginMutation = graphql(LOGIN_MUTATION, {
	props: ({mutate}) => ({
		localLogin: (email, password) => mutate({
			variables: {
				input: {
					email: email,
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
		registerUser: (displayname, email, password) => mutate({
			variables: {
				input: {
					fullName: displayname,
					email: email,
					password: password
				}
			}
		})
	})
})

export default LOGIN_MUTATION
