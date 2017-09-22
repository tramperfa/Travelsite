import React from 'react'
import { gql, graphql } from 'react-apollo'
//import persist from '../lib/persist'
import PropTypes from 'prop-types'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.login = props.login
  }

  handleSubmit(e) {
    e.preventDefault()


    const emailorusername = e.target.elements.emailorusername.value
    const password = e.target.elements.password.value

    if (emailorusername === '' || password === '') {
      window.alert('All fields are required.')
      return false
    }

    this.login(emailorusername, password)
    .then(({ data }) => {
      console.log('GOT DATAAAAA', data);

    })
    .catch((err) => {
      console.log('there was an error during login', err);
    });



    // reset form
    e.target.elements.emailorusername.value = ''
    e.target.elements.password.value = ''
  }



  render() {
    return (
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
    )
  }
}





const LoginMutation = gql`
  mutation login($input: localLoginInput!) {
    localLogin(input: $input) {
          fullName
          #avatar

    }
  }
 `;

Login.propTypes = () => ({
  login: PropTypes.func.isRequired,
  //fullName: PropTypes.string.isRequired
})



export default graphql(LoginMutation, {
  props: ({ mutate }) => ({
    login: (emailorusername, password) => mutate({
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



// update: (proxy, { data : {localLogin} }) => {
//   console.log("reaching update");
//   console.log("data:  "  + localLogin);
//
//   if (localLogin) {
//     console.log("adding local storage")
//     persist.willSetSessionUser(localLogin.fullName)
//     // Write our data back to the cache.
//     //proxy.writeQuery({data: localLogin })
//   } else {
//     console.log("NOT adding local storage")
//
//   }
// }
