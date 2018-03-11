import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {Redirect} from 'react-dom';

//
import persist from '../../lib/persist';
import {ComposeQuery} from '../../lib/hoc';
import {WithLoginMutation} from '../../graphql/user';
import {resetApolloStore} from '../../graphql/graphql';
import {loadUserInfo, logoutUserInfo} from '../../redux/actions';
import {WithUserSelfInfoQuery} from '../../graphql/user';

//
import SignIn from './SignIn';

class SignInContainer extends React.Component {

	state = {
		name: '',
		password: '',
		alreadyLogin: false,
		errorMessage: null
	}

	componentDidMount() {
		//console.log(this.props.MeData);
		if (this.props.MeData.userSelf) {
			this.setState({alreadyLogin: true})
		} else {
			persist.willRomveSessionUser()
			this.props.logoutUserInfoDispatch()
		}
	}

	handleSubmit = async () => {
		const email = this.state.name
		const password = this.state.password
		try {
			let data = await this.props.localLogin(email, password)
			let me = await persist.willSetSessionUser(data.data.localLogin.me)
			await this.props.loadUserInfoDispatch(me)
			await resetApolloStore()
		} catch (error) {
			this.setState({errorMessage: error.graphQLErrors[0].message})
		} finally {
			this.setState({password: ''})
		}
	}

	handleChange = name => event => {
		this.setState({[name]: event.target.value});
	};

	handleKeyPress = (event) => {
		if (event.charCode === 13) { // enter key pressed
			event.preventDefault()
			this.handleSubmit()
		}
	}

	render() {
		if (this.state.alreadyLogin) {
			return (<Redirect replace={true} to={`/NotFound`}/>)
		}

		return (
			<div>
				<SignIn
					handleKeyPress={this.handleKeyPress}
					state={this.state}
					handleClose={this.handleClose}
					handleChange={this.handleChange}
					handleSubmit={this.handleSubmit}/>
			</div>
		)
	}
}

SignInContainer.propTypes = {
	localLogin: PropTypes.func.isRequired,
	loadUserInfoDispatch: PropTypes.func.isRequired,
	MeData: PropTypes.object.isRequired
}

const mapDispatchToProps = (
	{loadUserInfoDispatch: loadUserInfo, logoutUserInfoDispatch: logoutUserInfo}
)

const SignInContainerWithComposeQuery = ComposeQuery(SignInContainer, "MeData")

export default compose(
	WithLoginMutation,
	connect(null, mapDispatchToProps),
	WithUserSelfInfoQuery
)(SignInContainerWithComposeQuery)
