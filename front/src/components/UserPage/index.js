import React from 'react';
import {withStyles} from 'material-ui/styles';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
//import Paper from 'material-ui/Paper';

import UserHome from './UserHome';
import UserStory from './UserStory';
import UserDeleteStory from './UserDeleteStory';
import UserHeader from './UserHeader';

const styles = theme => ({
	root: {
		flexGrow: 1,
		marginTop: theme.spacing.unit * 3
	}
});

//

const UserPage = ({match}) => {
	return (
		<div>
			<UserHeader match={match}/>
			<Switch>
				<Route path={`${match.path}`} exact={true} component={UserHome}/>
				<Route path={`${match.path}/story`} exact={true} component={UserStory}/>
				<Route path={`${match.path}/story/delete`} component={UserDeleteStory}/>
				<Route path={`${match.path}/review`} component={null}/>
				<Route path={`${match.path}/archive`} component={null}/>
			</Switch>
		</div>
	)
}

UserPage.propTypes = {
	match: PropTypes.object.isRequired
}

export default withStyles(styles)(UserPage)
