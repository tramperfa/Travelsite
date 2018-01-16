import React from 'react';
import PropTypes from 'prop-types';
//import {compose} from 'recompose';
import {connect} from 'react-redux';
import Slide from 'material-ui/transitions/Slide';
import Dialog from 'material-ui/Dialog';

//
import AuthDialogContainer from './AuthDialogContainer';
import SignupDialogContainer from './SignupDialogContainer';

//

import {closeLoginDialog} from '../redux/actions';

const AuthSignupDialog = ({loginDialogState, closeDialogDispatch}) => {

	return (
		<div>
			<Dialog
				open={loginDialogState.openLogin}
				transition={Slide}
				onClose={closeDialogDispatch}>
				{
					loginDialogState.switchToSignup
						? <SignupDialogContainer/>
						: <AuthDialogContainer/>
				}

			</Dialog>
		</div>
	)
}

AuthSignupDialog.propTypes = {
	loginDialogState: PropTypes.object.isRequired,
	closeDialogDispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({loginDialogState: state.loginDialog})

const mapDispatchToProps = ({closeDialogDispatch: closeLoginDialog});

export default connect(mapStateToProps, mapDispatchToProps)(AuthSignupDialog)
