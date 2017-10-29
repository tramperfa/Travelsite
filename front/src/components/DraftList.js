import React from 'react'
//import {Link} from 'react-router-dom'
import {gql, graphql} from 'react-apollo'
import DraftCard from './DraftCard'

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
          <DraftCard draft={draft}/>
        </div>
      ))}
    </div>
  );
};

export const draftsListQuery = gql `
  query draftQuery {
    myDrafts {
      _id
      author{
        fullName
      }
      title
      lastUpdate
    }
  }
`;

export default graphql(draftsListQuery, {})(draftsList);
