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
  console.log(stories);
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
        (<div key={story._id} className={'story ' + (story._id < 0 ? 'optimistic' : '')}>
          <Link to={story._id < 0 ? `/` : `story/${story._id}`}>
            {story.title}
            {story._id}
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
      _id
      user
      title
      snapshotContent
      viewCount
      likeCount
      commentCount
    }
  }
`;

export default graphql(storiesListQuery, {
  options: { pollInterval: 5000 },
})(storiesList);
