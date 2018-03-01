import React from 'react';
import PropTypes from 'prop-types';

//
import ComposeQuery from '../../lib/hoc';
import {withPublicUserByIDQuery} from '../../graphql/publicUser';

const UserHome = ({userData, match}) => {
	const user = userData.PublicUserByID
	return (
		<div>
			<div>
				<div>{"Name: " + user.fullName}</div>
				<div>{user._id}</div>
			</div>
		</div>
	)
}

UserHome.propTypes = {
	match: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired
}

const UserHomeWithComposeQuery = ComposeQuery(UserHome, 'userData')

export default withPublicUserByIDQuery(UserHomeWithComposeQuery)