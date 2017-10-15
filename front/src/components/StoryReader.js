import React from 'react';
import moment from 'moment';

import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const StoryDetails = ({
  data: {
    loading,
    error,
    story
  },
  match
}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.graphQLErrors[0].message}</p>;
  }

  return (
    <div>
      <div>
        <div>{"Tiltle: " + story.title}</div>
        <div>{"Author: " + story.author}</div>
        <div>{story.likeCount + "Likes"}</div>
        <div>{story.viewCount + "Views"}</div>
        <div>
          {moment(new Date(story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
        </div>
      </div>
    </div>
  );
}

export const StoryDetailsQuery = gql `
  query StoryQuery($_id : ID!) {
    story(_id: $_id) {
      _id
      title
      author{
        fullName
      }
      lastUpdate
      viewCount
      commentCount
      likeCount
      content
    }
  }
`

export default(graphql(StoryDetailsQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  })
})(StoryDetails));
