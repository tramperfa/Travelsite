import React from 'react';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

//
import NavSection from './NavSection';
import LoginSection from './LoginSection';
import UserSectionContainer from '../../containers/UserSectionContainer';

const styles = theme => ({
	root: {
		width: '100%'
	},
	appbar: {
		height: '44px',
		backgroundColor: '#333333'
	},
	toolbar: {
		flex: 1,
		justifyContent: 'space-between',
		minHeight: '44px',
		backgroundColor: '#333333'
	},
	login: {
		flex: 'none',
		justifyContent: 'flex-end'
	}
});

const Header = ({classes, userLocalStoreState}) => {
	return (
		<div className={classes.root}>
			<AppBar position="static" className={classes.appbar}>
				<Toolbar className={classes.toolbar}>
					<NavSection/>
					<div className={classes.login}>
						{
							!userLocalStoreState.loading && (
								userLocalStoreState.me && userLocalStoreState.me.fullName
									? <UserSectionContainer/>
									: <LoginSection/>
							)
						}
					</div>
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default withStyles(styles)(Header)
