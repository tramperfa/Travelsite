import React from 'react';
import PropTypes from 'prop-types';

import {ComposeQuery} from '../../../lib/hoc';
import {WithUserSelfAvatarQuery} from '../../../graphql/user';

import SettingAvatar from '../../UserPage/SettingAvatar'
import CONSTS from '../../../lib/consts'

const UserAvatar = ({MeData}) => {
	console.log(MeData.userSelf);
	const currentAvatar = MeData.userSelf.avatar
		? CONSTS.BUCKET_NAME + MeData.userSelf.avatar.avatar124px.filename
		: undefined
	return (
		<div>
			<div>Place Holder for User Setting Home</div>
			<SettingAvatar currentAvatar={currentAvatar}/>
		</div>
	)
}

UserAvatar.propTypes = {
	MeData: PropTypes.object.isRequired
}

const UserAvatarWithComposeQuery = ComposeQuery(UserAvatar, 'MeData')

export default WithUserSelfAvatarQuery(UserAvatarWithComposeQuery)

//export default UserAvatar