import React from 'react';
import {graphql} from 'react-apollo';

//
import {draftsListQuery} from '../graphql/draft';

//
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

export default graphql(draftsListQuery, {
  options: {
    fetchPolicy: 'network-only'
  }
})(draftsList);
