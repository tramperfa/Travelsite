import gql from 'graphql-tag';

////// QUERY
export const meQuery = gql `
  query meQuery {
    me {
      _id
      likeStory
      archiveStory
    }
  }
`;

export const userDetailQuery = gql `
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

export const LoginMutation = gql `
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

export const LogoutMutation = gql `
  mutation logout($name: String){
    logout(fullName: $name) {
      success
    }
  }
  `;

export const RegisterUserMutation = gql `
   mutation registerUser($input: registerUserInput!) {
     registerUser(input: $input) {
       _id
     }
   }
  `;

export default LoginMutation
