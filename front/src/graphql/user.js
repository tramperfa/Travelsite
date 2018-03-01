import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {USER_BASIC_FRG} from './userFragment';

////// QUERY
export const USER_SELF_QUERY = gql `
  query UserSelfQuery($userID : ID!) {
    userSelf(userID: $userID){
      ...userBasic
    }
  }
  ${USER_BASIC_FRG}
`;

const ReduxWithUserSelfQuery = graphql(USER_SELF_QUERY, {
	options: (props) => ({
		variables: {
			userID: 'MYSELF'
		}
	}),
	name: 'MeData'
})

const mapStateToProps = (state) => (
	{userLocalStoreState: state.userLocalStore}
)

export const WithUserSelfQuery = connect(mapStateToProps, null)

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
