import React from 'react';

import {
    gql,
    graphql,
} from 'react-apollo';

import NotFound from './NotFound';

const StoryDetails = ({ data: {loading, error, story }, match }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  if(story === null){
    return <NotFound />
  }

  return (
    <div>
      <div className="channelName">
        {story.title}
        {story.snapshotContent}
        {story.likeCount + "Likes"}, {story.viewCount + "Views"}
      </div>
    </div>);
}

export const StoryDetailQuery = gql`
  query StoryDetailsQuery($_id : ID!) {
    story(_id: $_id) {
      _id
      title
      snapshotContent
      viewCount
      commentCount
      likeCount
      content
    }
  }
`;

export default (graphql(StoryDetailQuery, {
  options: (props) => ({
    variables: { _id: props.match.params._id },
  }),
})(StoryDetails));
