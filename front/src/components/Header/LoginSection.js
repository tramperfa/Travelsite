import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'material-ui/Button';
import {connect} from 'react-redux';

import {openLoginDialog} from '../../redux/actions';

const LoginSection = ({openLoginDialogDispatch}) => {
	return (
		<div>
			<Button className="login" color="contrast" onClick={openLoginDialogDispatch}>Login</Button>
			<Link to="/signup">
				<Button className="signup" color="contrast">Signup</Button>
			</Link>
		</div>

	)
}

const mapDispatchToProps = ({openLoginDialogDispatch: openLoginDialog})

export default connect(null, mapDispatchToProps)(LoginSection)
