import React from 'react';
import {withStyles} from 'material-ui/styles';
import {Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Loadable from 'react-loadable';
//import Paper from 'material-ui/Paper';

import LoadingSplitCode from '../../lib/LoadingSplitCode';

import UserDraft from './UserDraft';
import UserDeleteStory from './UserDeleteStory';

const LoadableStoryEditor = Loadable({
	loader: () => import (/* webpackChunkName: 'Editor' */
	'../StoryEditor'),
	loading: LoadingSplitCode,
	delay: 1000
})

const styles = theme => ({
	root: {
		flexGrow: 1,
		marginTop: theme.spacing.unit * 3
	}
});

//<UserHeader match={match}/>

const UserPage = ({match}) => {
	return (
		<div>

			<Switch>
				<Route path={`${match.path}/draft`} component={UserDraft}/>
				<Route path={`${match.path}/edit/:_id`} component={LoadableStoryEditor}/>
				<Route path={`${match.path}/storydelete`} component={UserDeleteStory}/>
				<Route path={`${match.path}/archive`} component={null}/>
			</Switch>
		</div>
	)
}

UserPage.propTypes = {
	match: PropTypes.object.isRequired
}

export default withStyles(styles)(UserPage)
