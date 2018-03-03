import React from 'react';
import {withStyles} from 'material-ui/styles';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';

import UserSettingNav from './UserSettingNav';
import UserSettingHome from './UserSettingHome';
import Avatar from './Avatar';

const styles = theme => ({
	root: {
		flexGrow: 1,
		marginTop: theme.spacing.unit * 3
	}
});

const UserSetting = ({match}) => {
	return (
		<div>
			<UserSettingNav match={match}/>
			<Switch>
				<Route path={`${match.path}`} exact={true} component={UserSettingHome}/>
				<Route path={`${match.path}/avatar`} exact={true} component={Avatar}/>
			</Switch>
		</div>
	)
}

UserSetting.propTypes = {
	match: PropTypes.object.isRequired
}

export default withStyles(styles)(UserSetting)
