import React from 'react'
import {Link} from 'react-router-dom'
import {gql, graphql} from 'react-apollo'

const draftsList = ({
  data: {
    loading,
    error,
    myDrafts
  }
}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      {myDrafts.map(draft => (
        <div key={draft._id} className='draft'>
          <Link to={draft._id < 0
            ? `/`
            : `draft/${draft._id}`}>
            {draft.title}
            {"   author:  " + draft.author}
            {/* {draft.snapshotContent} */}
          </Link>
        </div>
      ))}
    </div>
  );
};

export const draftsListQuery = gql `
  query draftQuery {
    myDrafts {
      _id
      author
      title
      snapshotContent
    }
  }
`;

export default graphql(draftsListQuery, {})(draftsList);
