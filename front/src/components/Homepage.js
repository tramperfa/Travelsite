import React from 'react';
import {
  Link
} from 'react-router-dom'

import {
    gql,
    graphql,
} from 'react-apollo';

import Editor from './Editor';


const storiesList = ({ data: {loading, error, stories }}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="storiesList">
      <Editor />
      { stories.map( story =>
        (<div key={story.storyID} className={'story ' + (story.storyID < 0 ? 'optimistic' : '')}>
          <Link to={story.storyID < 0 ? `/` : `story/${story.storyID}`}>
            {story.storyName}
            {story.snapshotContent}
          </Link>
        </div>)
      )}
    </div>
  );
};

export const storiesListQuery = gql`
  query poularStoryQuery {
    stories {
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

export default graphql(storiesListQuery, {
  options: { pollInterval: 5000 },
})(storiesList);
