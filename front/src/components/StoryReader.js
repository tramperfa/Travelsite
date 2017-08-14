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
        {story.storyName}
        {story.snapshotContent}
        {story.likeCount + "Likes"}, {story.viewCount + "Views"}
      </div>
    </div>);
}

export const StoryDetailQuery = gql`
  query StoryDetailsQuery($storyID : ID!) {
    story(storyID: $storyID) {
      storyID
      storyName
      snapshotContent
      authorID
      authorName
      destinationID
      destinationName
      viewCount
      replyCout
      likeCount
    }
  }
`;

export default (graphql(StoryDetailQuery, {
  options: (props) => ({
    variables: { storyID: props.match.params.storyID },
  }),
})(StoryDetails));
