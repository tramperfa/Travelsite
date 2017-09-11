import React from 'react'
import { gql, graphql } from 'react-apollo'
//import persist from '../../lib/persist'
//import userProfile from '../userProfile.gql'
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

    // reset form
    e.target.elements.emailorusername.value = ''
    e.target.elements.password.value = ''
  }

  // componentDidMount() {
  //   this.setState({ deviceInfo: device.info() })
  // }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <h1>Login (GraphQL)</h1>
        <input placeholder='emailorusername' name='emailorusername' defaultValue='katopz@gmail.com' />
        <input placeholder='password' name='password' defaultValue='foobar' />
        <button type='submit'>Login</button>
        {/* <style jsx>{`
          form {
            border-bottom: 1px solid #ececec;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 20px;
          }
          input {
            display: block;
            margin-bottom: 10px;
          }
        `}</style> */}
      </form>
    )
  }
}

const LoginMutation = gql`
  mutation login($input: localLoginInput!) {
    localLogin(input: $input) {
      _id
      username
      provider
    }
  }
 `;

Login.propTypes = () => ({
  login: PropTypes.func.isRequired
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
      // update: (proxy, { data }) => {
      //   // Keep session
      //   data.login && persist.willSetSessionToken(data.login.sessionToken)
      //
      //   // Read the data from our cache for this query.
      //   let cached = proxy.readQuery({ query: me })
      //
      //   // Errors
      //   cached.errors = data.errors
      //
      //   // User
      //   if (data.login) {
      //     cached.user = data.login.user
      //
      //     // Authen
      //     cached.authen = {
      //       isLoggedIn: data.login.isLoggedIn,
      //       sessionToken: data.login.sessionToken,
      //       __typename: 'Authen'
      //     }
      //   }
      //
      //   // Write our data back to the cache.
      //   proxy.writeQuery({ data: cached })
      // }
    })
  })
})(Login)
