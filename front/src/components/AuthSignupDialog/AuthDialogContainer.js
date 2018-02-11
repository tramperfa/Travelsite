import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//
import persist from '../../lib/persist';
import {WithLoginMutation} from '../../graphql/user';
import {resetApolloStore} from '../../graphql/graphql';
import {setErrorMessage, renderForError, GraphQLErrorComponent} from '../../lib/apollo';
import {closeLoginDialog, loadUserInfo} from '../../redux/actions';

//
import AuthDialog from './AuthDialog';

class AuthDialogContainer extends React.Component {

	state = {
		name: '',
		password: '',
		errorMessage: null
	}

	handleSubmit = async () => {
		const email = this.state.name
		const password = this.state.password
		try {
			let data = await this.props.localLogin(email, password)
			let me = await persist.willSetSessionUser(data.data.localLogin.me)
			await this.props.loadUserInfoDispatch(me)
			await this.props.closeDialogDispatch()
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

	handleClose = () => {
		this.props.closeDialogDispatch()
		this.setState({name: '', password: ''})
	}

	render() {
		return (
			<div>
				<AuthDialog
					handleKeyPress={this.handleKeyPress}
					state={this.state}
					handleClose={this.handleClose}
					handleChange={this.handleChange}
					handleSubmit={this.handleSubmit}/>
			</div>
		)
	}
}

AuthDialogContainer.propTypes = {
	localLogin: PropTypes.func.isRequired,
	loadUserInfoDispatch: PropTypes.func.isRequired,
	closeDialogDispatch: PropTypes.func.isRequired
}

const mapDispatchToProps = (
	{closeDialogDispatch: closeLoginDialog, loadUserInfoDispatch: loadUserInfo}
)

export default compose(
	WithLoginMutation,
	connect(null, mapDispatchToProps),
	setErrorMessage("data"),
	renderForError(GraphQLErrorComponent, "data")
)(AuthDialogContainer)
