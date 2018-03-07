import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {openLoginDialog} from '../redux/actions';
import {withRouter} from 'react-router-dom'

const onError = ({errorMessage, openLoginDialogDispatch, history}) => {
	switch (errorMessage) {
		case 'User Not Logged In':
			openLoginDialogDispatch();
			break;
		case 'User Not Authorized':
			history.replace('/login');
			break;
		default:
			history.replace('/notFound');
	}
}

const mapDispatchToProps = ({openLoginDialogDispatch: openLoginDialog})

export default compose(connect(null, mapDispatchToProps), withRouter)(onError)
