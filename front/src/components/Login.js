import React from 'react';
import { gql, graphql } from 'react-apollo';
import persist from '../lib/persist';
import PropTypes from 'prop-types';

import {
  //BrowserRouter,
  //Link,
  Route,
} from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.localLogin = props.localLogin
    this.onLoginLogout = props.onLoginLogout
  }

  handleSubmit(e) {
    e.preventDefault()


    const emailorusername = e.target.elements.emailorusername.value
    const password = e.target.elements.password.value

    if (emailorusername === '' || password === '') {
      return false
    }

    this.localLogin(emailorusername, password)
    .then(({ data }) => {
      //console.log('GOT DATA', data);
      return persist.willSetSessionUser(data.localLogin.me)
    })
    .then((me) => {
      return this.onLoginLogout(me)
    })
    .catch((err) => {
      console.log('there was an error during login', err);
      console.log(JSON.stringify(err));
    })



    // reset form
    e.target.elements.emailorusername.value = ''
    e.target.elements.password.value = ''
  }



  render() {
    return (
      <Route path="/login">
        <div>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <h1>Login (GraphQL)</h1>
            <input placeholder='email or username' name='emailorusername' defaultValue='' />
            <input placeholder='password' name='password' defaultValue='' />
            <button type='submit'>Login</button>
          </form>
          <div className="channelName">
            {this.localLogin}
          </div>
        </div>
      </Route>

    )
  }
}





const LoginMutation = gql`
  mutation localLogin($input: localLoginInput!) {
    localLogin(input: $input) {
      me {
          fullName
          #avatar
      }
    }
  }
 `;

Login.propTypes = () => ({
  localLogin: PropTypes.func.isRequired,
  onLoginLogout: PropTypes.func.isRequired
})



export default graphql(LoginMutation, {
  props: ({ mutate }) => ({
    localLogin: (emailorusername, password) => mutate({
      variables: {
        input: {
          emailorusername: emailorusername,
          password: password
        }
      }
    })
  })
}
)(Login)
