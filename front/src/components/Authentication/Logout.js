import React from 'react';
import {gql, graphql} from 'react-apollo';
import PropTypes from 'prop-types';
//import Button from 'material-ui/Button';
//import Typography from 'material-ui/Typography';
import {MenuItem} from 'material-ui/Menu';
import {ApolloClient} from 'react-apollo';

//
import persist from '../../lib/persist';

class Logout extends React.Component {

  handleLogout = async() => {
    try {
      await this.props.logout()
      await persist.willRomveSessionUser()
      await this.props.onLogout()
      return this.props.client.resetStore()
    } catch (e) {
      console.log('there was an error during logout', e);
      console.log(JSON.stringify(e));
    } finally {}

    // Refactored Nov,21
    // this.props.logout().then((success) => {
    //   return persist.willRomveSessionUser()
    // }).then(() => {
    //   return this.props.onLogout()
    // }).then(() => {
    //   // console.log("RESET STORE");
    //   return this.props.client.resetStore()
    // }).catch((err) => {
    //   console.log('there was an error during logout', err);
    //   console.log(JSON.stringify(err));
    // })
  }

  render() {
    return (
      <div>
        {/* <Typography color="accent">
          Hello, {this.props.me.fullName}
        </Typography> */}
        <MenuItem onClick={this.handleLogout.bind(this)}>Logout</MenuItem>

      </div>

    )
  }

}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  client: PropTypes.instanceOf(ApolloClient).isRequired
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
