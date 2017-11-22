import React from 'react';
import PropTypes from 'prop-types';
import {gql, graphql} from 'react-apollo';
//import Button from 'material-ui/Button';

class MyHome extends React.Component {

  render() {
    const user = this.props.userData.user
    if (this.props.userData.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (
      <div>
        <div>
          <div>{"FullName: " + user.fullName}</div>
          <div>{"Username: " + user.username}</div>
          <div>{user._id}</div>
          <div>{user.provider}</div>
        </div>
      </div>
    )

  }

}

MyHome.propTypes = {
  match: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  myStoryData: PropTypes.object.isRequired
}

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

export const withUserData = graphql(userDetailQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  }),
  name: 'userData'
})

export const myStoryQuery = gql `
  query myStoryQuery {
    myStories {
      _id
      title
      snapshotContent
      # Need Fragment ?
      # coverImage {
      #   _id
      #   browserCoverImage
      #   browserUserHomeCoverImage
      # }
      lastUpdate
      viewCount
      likeStoryCount
      archiveStoryCount
      commentCount
    }
  }
`;

export const withMyStoryData = graphql(myStoryQuery, {name: 'myStoryData'})

export default withMyStoryData(withUserData(MyHome))

// if (error) {
//   return <p>{error.graphQLErrors[0].message}</p>;
// }
