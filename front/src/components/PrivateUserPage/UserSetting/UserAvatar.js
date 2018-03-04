import React from 'react';
import PropTypes from 'prop-types';

import {ComposeQuery} from '../../../lib/hoc';
import {WithUserSelfAvatarQuery} from '../../../graphql/user';

const UserAvatar = ({MeData}) => {
	console.log(MeData.userSelf);
	return (<div>Place Holder for User Setting Home</div>)
}

UserAvatar.propTypes = {
	MeData: PropTypes.object.isRequired
}

const UserAvatarWithComposeQuery = ComposeQuery(UserAvatar, 'MeData')

export default WithUserSelfAvatarQuery(UserAvatarWithComposeQuery)

//export default UserAvatar