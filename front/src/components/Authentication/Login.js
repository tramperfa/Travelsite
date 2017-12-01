import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

//
import persist from '../../lib/persist';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  menu: {
    width: 200
  }
});

class Login extends React.Component {

  state = {
    name: '',
    password: '',
    errorMessage: null
  }

  handleSubmit = async () => {

    const emailorusername = this.state.name
    const password = this.state.password
    try {
      let data = await this.props.localLogin(emailorusername, password)
      let me = await persist.willSetSessionUser(data.data.localLogin.me)
      await this.props.onLogin(me)
      await this.props.handleRequestClose()
      //console.log("RESET STORE");
      await this.props.handleResetStore()
    } catch (error) {
      console.log('there was an error during login', error);
      this.setState({errorMessage: error.graphQLErrors[0].message})
    } finally {
      this.setState({name: '', password: ''})
    }

    // ///////////////////////////////////////////////////
    // this.props.localLogin(emailorusername, password).then(({data}) => {   return
    // persist.willSetSessionUser(data.localLogin.me) }).then((me) => {   return
    // this.props.onLogin(me) }).then((me) => {   return
    // this.props.handleRequestClose() }).then(() => {    console.log("RESET
    // STORE");    console.log(this.props.client);   return
    // this.props.client.resetStore() }).catch((error) => {   console.log('there was
    // an error during login', error);   console.log(JSON.stringify(error))
    // this.setState({errorMessage: error.graphQLErrors[0].message}) });
    //
    //
    // this.setState({name: '', password: ''})
    // //////////////////////////////////////////////////////////////////
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  onKeyPress = (event) => {
    if (event.charCode === 13) { // enter key pressed
      event.preventDefault()
      // do something here
      this.handleSubmit()
    }
  }

  handleClose = () => {

    this.props.handleRequestClose()
    this.setState({name: '', password: '', errorMessage: null})
  }

  render() {

    return (
      <div>

        <Dialog
          open={this.props.openLogin}
          transition={Slide}
          onRequestClose={this.handleClose}
          onKeyPress={this.onKeyPress}>
          <DialogTitle>{"Login"}</DialogTitle>
          <form
            className={this.props.classes.container}
            noValidate="noValidate"
            autoComplete="off">
            <DialogContent>
              <TextField
                id="name"
                label="Username or Email"
                className={this.props.classes.textField}
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"/>
              <TextField
                id="password"
                label="Password"
                className={this.props.classes.textField}
                type="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={this.handleChange('password')}
                margin="normal"/>
            </DialogContent>
            <div style={{
                color: 'red'
              }}>
              {this.state.errorMessage}
            </div>
          </form>
          <DialogActions>
            <Button onClick={this.handleSubmit} color="primary">
              SUBMIT
            </Button>
            <Button onClick={this.handleClose} color="primary">
              CANCEL
            </Button>
          </DialogActions>

        </Dialog>
      </div>
    )
  }
}

const LoginMutation = gql `
  mutation localLogin($input: localLoginInput!) {
    localLogin(input: $input) {
      me {
          fullName
          _id
          #avatar
      }
    }
  }
 `;

Login.propTypes = {
  localLogin: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  openLogin: PropTypes.bool.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  handleResetStore: PropTypes.func.isRequired
}

const LoginWithMuation = graphql(LoginMutation, {
  props: ({mutate}) => ({
    localLogin: (emailorusername, password) => mutate({
      variables: {
        input: {
          emailorusername: emailorusername,
          password: password
        }
      }
    })
  })
})(Login)

export default withStyles(styles)(LoginWithMuation);
