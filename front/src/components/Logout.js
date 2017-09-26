import React from 'react';
import { gql, graphql } from 'react-apollo';
import persist from '../lib/persist';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';



const Logout = ({ data: {loading, error, logout}}, onLoginLogout) => {
  if (loading) {
  return <p>Log Out in Process...</p>;
  }
  if (error) {
  return <p>{error.message}</p>;
  }
  if (logout.success) {
    persist.willRomveSessionUser()
    .then(() => {
      console.log("REACHING HERE");
      onLoginLogout();
    })
    .catch((err) => {
      console.log('there was an error during logout', err);
      console.log(JSON.stringify(err));
    })
  }

  return (
    <Button color="contrast">Logout</Button>
  );

};


Logout.propTypes = () => ({
  onLoginLogout: PropTypes.func.isRequired
})



const logoutQuery = gql`
  query logout {
    logout {
      success
    }
  }
`;


export default graphql(logoutQuery
)(Logout)
