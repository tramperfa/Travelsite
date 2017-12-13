import React from 'react';
import {graphql} from 'react-apollo';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import {Redirect} from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory' const history =
// createHistory()

import {REGISTER_USER_MUTATION} from '../graphql/user';

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

class Signup extends React.Component {

	state = {
		username: '',
		displayname: '',
		email: '',
		password: '',
		errorMessage: null,
		redirect: false
	}

	handleSubmit = () => {

		const {username, displayname, email, password} = this.state;
		this.props.registerUser(username, displayname, email, password).then(() => {
			this.setState(
				{username: '', displayname: '', email: '', password: '', redirect: true}
			)
		}).catch((error) => {
			//console.log('there was an error during login', error);
			this.setState({errorMessage: error.graphQLErrors[0].message, password: ''})
		})

	}

	handleChange = name => event => {
		this.setState({[name]: event.target.value});
	};

	onKeyPress = (event) => {
		if (event.charCode === 13) {
			event.preventDefault()
			this.handleSubmit()
		}
	}

	handleSwitch = () => {
		console.log("TBD: switch to signin");
	}

	render() {
		if (this.state.redirect) {
			//console.log(this.props.draftData.draft.story);
			return <Redirect replace="replace" to="/"/>;
		}

		return (
			<div>
				<form
					className={this.props.classes.container}
					noValidate="noValidate"
					autoComplete="off">
					<TextField
						required={true}
						id="username"
						label="Username"
						className={this.props.classes.textField}
						value={this.state.name}
						onChange={this.handleChange('username')}
						margin="normal"/>
					<TextField
						required={true}
						id="displayname"
						label="Displayname"
						className={this.props.classes.textField}
						value={this.state.name}
						onChange={this.handleChange('displayname')}
						margin="normal"/>
					<TextField
						required={true}
						id="email"
						label="Email"
						className={this.props.classes.textField}
						value={this.state.name}
						onChange={this.handleChange('email')}
						margin="normal"/>
					<TextField
						required={true}
						id="password"
						label="Password"
						className={this.props.classes.textField}
						type="password"
						autoComplete="current-password"
						value={this.state.password}
						onChange={this.handleChange('password')}
						margin="normal"/>
					<div style={{
							color: 'red'
						}}>
						{this.state.errorMessage}
					</div>
				</form>
				<Button onClick={this.handleSubmit} color="primary">
					SUBMIT
				</Button>
				<Button onClick={this.handleSwitch} color="primary">
					SIGNIN
				</Button>
			</div>
		)
	}
}

Signup.propTypes = {
	registerUser: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
}

const WithRegisterUserMutation = graphql(REGISTER_USER_MUTATION, {
	props: ({mutate}) => ({
		registerUser: (username, displayname, email, password) => mutate({
			variables: {
				input: {
					username: username,
					fullName: displayname,
					email: email,
					password: password
				}
			}
		})
	})
})

export default WithRegisterUserMutation(withStyles(styles)(Signup))
