import React from 'react';
import moment from 'moment';

import {gql, graphql} from 'react-apollo';

import NotFound from './NotFound';

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
  if (story === null) {
    return <NotFound/>
  }

  return (
    <div>
      <div>
        <div>{"Tiltle: " + story.title}</div>
        <div>{"Author: " + story.author}</div>

        <div>
          {moment(new Date(story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
        </div>
      </div>
    </div>
  );
}

export const StoryDetailQuery = gql `
  query StoryDetailsQuery($_id : ID!) {
    story(_id: $_id) {
      _id
      title
      author
      lastUpdate
      snapshotContent
      viewCount
      commentCount
      likeCount
      content
    }
  }
`;

export default(graphql(StoryDetailQuery, {
  options: (props) => ({
    variables: {
      _id: props.match.params._id
    }
  })
})(StoryDetails));

//import Editor from './Editor';
