import React from 'react'
import {Link} from 'react-router-dom'
import {gql, graphql} from 'react-apollo'

//import Highlight from './Hignlight';

const storiesList = ({
  data: {
    loading,
    error,
    stories
  }
}) => {
  //console.log(stories);
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <div>
        {/* <Highlight></Highlight> */}
      </div>
      {stories.map(story => (
        <div key={story._id} className='story'>
          <Link to={story._id < 0
            ? `/`
            : `story/${story._id}`}>
            {story.title}
            {"  ID:   " + story._id}
            {story.snapshotContent}
          </Link>
        </div>
      ))}
    </div>
  );
};

export const storiesListQuery = gql `
  query poularStoryQuery {
    stories {
      _id
      author
      title

      snapshotContent
      viewCount
      likeCount
      commentCount
    }
  }
`;

export default graphql(storiesListQuery, {})(storiesList);
