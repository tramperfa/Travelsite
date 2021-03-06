import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
//import {compose} from 'recompose';
import {openLoginDialog} from '../redux/actions';
import {Redirect} from 'react-router-dom'

class ErrorComp extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.error.errorMessage === 'User Not Logged In') {
			console.log("CALLED");
			this.props.openLoginDialogDispatch()
		}
	}

	render() {
		if (this.props.error.errorMessage === 'User Not Authorized') {
			return <Redirect replace={true} to={`/login`}/>
		} else if (this.props.error.errorMessage === 'Cannot Find Requested Information') {
			return <Redirect replace={true} to={`/NotFound`}/>
		} else {
			return null
		}
	}
}

ErrorComp.propTypes = {
	openLoginDialogDispatch: PropTypes.func.isRequired,
	error: PropTypes.object.isRequired
}

const mapDispatchToProps = ({openLoginDialogDispatch: openLoginDialog})

export default connect(null, mapDispatchToProps)(ErrorComp)
