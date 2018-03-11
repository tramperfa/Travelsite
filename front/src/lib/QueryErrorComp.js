import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
//import {compose} from 'recompose';
import {openLoginDialog} from '../redux/actions';
import {Redirect} from 'react-router-dom'

class QueryErrorComp extends React.Component {

	render() {
		var errorInfo = this.props.errorInfo
		if (errorInfo === 'User Not Logged In' || errorInfo === 'User Not Authorized') {
			return <Redirect replace={true} to={`/login`}/>
		} else if (errorInfo === 'Cannot Find Requested Information') {
			return <Redirect replace={true} to={`/NotFound`}/>
		} else {
			return null
		}
	}
}

QueryErrorComp.propTypes = {
	openLoginDialogDispatch: PropTypes.func.isRequired,
	errorInfo: PropTypes.string.isRequired
}

const mapDispatchToProps = ({openLoginDialogDispatch: openLoginDialog})

export default connect(null, mapDispatchToProps)(QueryErrorComp)
