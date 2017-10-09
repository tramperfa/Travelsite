import React from 'react';
import moment from 'moment';

import {gql, graphql} from 'react-apollo';

import NotFound from './NotFound';

const userDetails = ({
  data: {
    loading,
    error,
    user
  },
  match
}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.graphQLErrors[0].message}</p>;
  }
  if (user === null) {
    return <NotFound/>
  }

  return (
    <div>
      <div>
        <div>{"FullName: " + user.fullName}</div>
        <div>{"Username: " + user.username}</div>
        <div>{user._id}</div>
        <div>{user.provider}</div>
        <div>
          {moment(new Date(user.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
        </div>
      </div>
    </div>
  );
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

export default(graphql(userDetailQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  })
})(userDetails));
