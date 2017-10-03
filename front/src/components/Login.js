import React from 'react';
import {gql, graphql} from 'react-apollo';
import persist from '../lib/persist';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

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
    password: ''
  }

  handleClick = () => {

    const emailorusername = this.state.name
    const password = this.state.password

    //console.log("CLICK STATE :  " + JSON.stringify(this.state));

    this.props.localLogin(emailorusername, password).then(({data}) => {
      return persist.willSetSessionUser(data.localLogin.me)
    }).then((me) => {
      return this.props.onLogin(me)
    }).then((me) => {
      return this.props.handleRequestClose()
      // }).then(() => {
      //   this.setState({name: '', password: ''})
    }).catch((err) => {
      console.log('there was an error during login', err);
      console.log(JSON.stringify(err));
    })

  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  render() {

    return (
      <div>

        <Dialog open={this.props.openLogin} transition={Slide} onRequestClose={this.handleRequestClose}>
          <DialogTitle>{"Login"}</DialogTitle>
          <form className={this.props.classes.container} noValidate autoComplete="off">
            <DialogContent>
              <TextField id="name" label="Name" className={this.props.classes.textField} value={this.state.name} onChange={this.handleChange('name')} margin="normal"/>
              <TextField id="password" label="Password" className={this.props.classes.textField} type="password" autoComplete="current-password" value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClick} color="primary">
                SUBMIT
              </Button>
              <Button onClick={this.handleRequestClose} color="primary">
                CANCEL
              </Button>
            </DialogActions>
          </form>

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
  handleRequestClose: PropTypes.func.isRequired
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
