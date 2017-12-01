import React from 'react';
//import {Link} from 'react-router-dom'
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import DraftCard from './DraftCard';

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
  //console.log(myDrafts);

  return (
    <div>
      {
        myDrafts.map(draft => (
          <div key={draft._id} className='draft'>
            <DraftCard draft={draft}/>
          </div>
        ))
      }
    </div>
  );
};

export const draftsListQuery = gql `
  query DraftQuery {
    myDrafts {
      _id
      title
      author{
        _id
        fullName
      }
      headlineImage{
        _id
        browserHeadlineImage{
          filename
        }
      }
      lastUpdate
    }
  }
`;

export default graphql(draftsListQuery, {})(draftsList);
