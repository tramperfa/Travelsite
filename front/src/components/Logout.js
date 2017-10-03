import React from 'react';
import {gql, graphql} from 'react-apollo';
import persist from '../lib/persist';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

class Logout extends React.Component {

  handleLogout() {
    this.props.logout("name").then((success) => {
      return persist.willRomveSessionUser()
    }).then(() => {
      return this.props.onLogout()
    }).catch((err) => {
      console.log('there was an error during logout', err);
      console.log(JSON.stringify(err));
    })
  }

  render() {
    return (
      <div>
        <Typography color="accent">
          Hello, {this.props.me.fullName}
        </Typography>
        <Button color="contrast" onClick={this.handleLogout.bind(this)}>Logout</Button>
      </div>
    )
  }

}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired
}

const LogoutMutation = gql `
mutation logout($name: String){
  logout(fullName: $name) {
    success
  }
}
`;

export default graphql(LogoutMutation, {
  props: ({mutate}) => ({
    logout: () => mutate()
  })
})(Logout)
