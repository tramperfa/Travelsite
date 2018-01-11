import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//
import persist from '../../lib/persist';
import {WithLoginMuation} from '../../graphql/user';
import {resetApolloStore} from '../../graphql/graphql';
import {setErrorMessage, renderForError, GraphQLErrorComponent} from '../../lib/apolloHelper';
import {closeLoginDialog} from '../../redux/actions';

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
		//errorMessage: null
	}

	handleSubmit = async () => {

		const emailorusername = this.state.name
		const password = this.state.password
		try {
			let data = await this.props.localLogin(emailorusername, password)
			let me = await persist.willSetSessionUser(data.data.localLogin.me)
			await this.props.onLogin(me)
			await this.props.handleCloseLoginDialog()
			//console.log("RESET STORE");
			await resetApolloStore()
		} catch (error) {
			console.log('there was an error during login', error);
			//this.setState({errorMessage: error.graphQLErrors[0].message})
		} finally {
			this.setState({name: '', password: ''})
		}

	}

	handleChange = name => event => {
		this.setState({[name]: event.target.value});
	};

	onKeyPress = (event) => {
		if (event.charCode === 13) { // enter key pressed
			event.preventDefault()
			this.handleSubmit()
		}
	}

	handleClose = () => {

		this.props.handleCloseLoginDialog()
		this.setState({name: '', password: ''})
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
							}}></div>
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

Login.propTypes = {
	localLogin: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	onLogin: PropTypes.func.isRequired,
	openLogin: PropTypes.bool.isRequired,
	handleCloseLoginDialog: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({openLogin: state.login.openLogin})

const mapDispatchToProps = ({handleCloseLoginDialog: closeLoginDialog})

export default compose(
	WithLoginMuation,
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps),
	setErrorMessage("data"),
	renderForError(GraphQLErrorComponent, "data")
)(Login)
