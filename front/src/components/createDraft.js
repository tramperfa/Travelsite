import React from 'react';
import { gql, graphql } from 'react-apollo';



const createStory = ({ mutate }) => {
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      mutate({
        variables: { user_id: '1'},
      });
      evt.target.value = '';
    }
  };

  return (
    evt.target.value()
    <input
      type="text"
      placeholder="New story"
      onKeyUp={handleKeyUp}
    />
  );
};

const createStoryMutation = gql`
  mutation createStory($user_id: String!) {
    createStory(user_id: $user_id) {
      _id
      title
      user_id
    }
  }
`;


const createStoryWithMutation = graphql(
  createStoryMutation,
)(createStory);

export default createStoryWithMutation;
