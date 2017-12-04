import React from 'react'
import {graphql} from 'react-apollo';
import StoryCard from '../components/StoryCard';
//import Highlight from './Highlight';

import {storiesListQuery} from '../graphql/story';

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

      {
        stories.map(story => (
          <div className="storyList" key={story._id}>
            <StoryCard story={story}/>
          </div>
        ))
      }
    </div>
  );
};

export default graphql(storiesListQuery)(storiesList);
