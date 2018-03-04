import React from 'react';
import PropTypes from 'prop-types';

import {ComposeQuery} from '../../../lib/hoc';
import {WithUserSelfInfoQuery} from '../../../graphql/user';

const UserInfo = ({MeData}) => {
	console.log(MeData.userSelf);
	return (<div>Place Holder for User INFO</div>)
}

UserInfo.propTypes = {
	MeData: PropTypes.object.isRequired
}

const UserInfoWithComposeQuery = ComposeQuery(UserInfo, 'MeData')

export default WithUserSelfInfoQuery(UserInfoWithComposeQuery)