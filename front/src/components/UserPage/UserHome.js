import React from 'react';
import PropTypes from 'prop-types';

import ComposeQuery from '../../lib/hoc';
import {withPublicUserByIDQuery} from '../../graphql/publicUser';

import AvatarSection from './AvatarSection'
import SettingAvatar from './SettingAvatar'
import DefaultAvatar from '../../images/defaultAvatar.jpg'

const UserHome = ({userData, match}) => {
	//console.log(userData.PublicUserByID);
	const user = userData.PublicUserByID
	return (
		<div>
			<div className="centerContainer">
				<AvatarSection user={user} match={match}/>
			</div>
			<SettingAvatar currentAvatar={DefaultAvatar}/>
		</div>
	)
}

UserHome.propTypes = {
	match: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired
}

const UserHomeWithComposeQuery = ComposeQuery(UserHome, 'userData')

export default withPublicUserByIDQuery(UserHomeWithComposeQuery)