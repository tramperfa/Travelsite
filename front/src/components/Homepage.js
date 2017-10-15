import React from 'react'
//import {Link} from 'react-router-dom'
import {gql, graphql} from 'react-apollo'

import StoryCard from './StoryCard';
//import Highlight from './Highlight';

const storiesList = ({
  data: {
    loading,
    error,
    stories
  }
}) => {

  // TODO Refactor loading animation
  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      {/* <div><Highlight/></div> */}
      {stories.map(story => (
        <div className="storyList" key={story._id}>
          <StoryCard story={story}/>
        </div>
      ))}
    </div>
  );
};

export const storiesListQuery = gql `
  query poularStoryQuery {
    stories {
      _id
      title
      snapshotContent
      viewCount
      likeCount
      commentCount
      author{
        fullName
      }
    }
  }
`;

export default graphql(storiesListQuery, {})(storiesList);
