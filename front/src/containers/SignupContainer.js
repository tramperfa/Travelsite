import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

//
import {WithRegisterUserMutation} from '../graphql/user';
import Signup from '../components/AuthSignup/Signup';

class SignupContainer extends React.Component {

	state = {
		username: '',
		displayname: '',
		email: '',
		password: '',
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
			return <Redirect replace="replace" to="/"/>;
		}
		return <Signup
			state={this.state}
			handleChange={this.handleChange}
			handleSubmit={this.handleSubmit}
			handleSwitch={this.handleSwitch}/>
	}
}

SignupContainer.propTypes = {
	registerUser: PropTypes.func.isRequired
}

export default WithRegisterUserMutation(SignupContainer)