import React from 'react';
import PropTypes from 'prop-types';

import {ComposeQuery} from '../../../lib/hoc';
import {WithUserSelfAccoutQuery} from '../../../graphql/user';

const UserAccount = ({MeData}) => {
	console.log(MeData.userSelf);
	return (<div>Place Holder for User Account</div>)
}

UserAccount.propTypes = {
	MeData: PropTypes.object.isRequired
}

const UserAccountWithComposeQuery = ComposeQuery(UserAccount, 'MeData')

export default WithUserSelfAccoutQuery(UserAccountWithComposeQuery)