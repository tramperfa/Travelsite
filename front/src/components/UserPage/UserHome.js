import React from 'react';
import PropTypes from 'prop-types';

//
import ComposeQuery from '../../lib/hoc';
import {withUserDetailQuery} from '../../graphql/user';

const UserHome = ({userData}) => {
	const user = userData.user
	return (
		<div>
			<div>
				<div>{"Name: " + user.fullName}</div>
				<div>{user._id}</div>
				<div>{user.provider}</div>
			</div>
		</div>
	)
}

UserHome.propTypes = {
	match: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired
}

const UserHomeWithComposeQuery = ComposeQuery(UserHome, 'userData')

export default withUserDetailQuery(UserHomeWithComposeQuery)