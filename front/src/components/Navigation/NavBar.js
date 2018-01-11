import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import {NavLink} from 'react-router-dom';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//
import {openLoginDialog} from '../../redux/actions';
// import IconButton from 'material-ui/IconButton'; import Drafts from
// "material-ui-icons/Drafts";

import Me from '../Authentication/Me';

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
	navsection: {
		flex: 'auto',
		justifyContent: 'flex-start'
	},
	login: {
		flex: 'none',
		justifyContent: 'flex-end'
	}
});

const MyLogin = ({handleOpenLoginDialog}) => {
	return (
		<div>
			<Button className="login" color="contrast" onClick={handleOpenLoginDialog}>Login</Button>
			<Link to="/signup">
				<Button className="signup" color="contrast">Signup</Button>
			</Link>
		</div>

	)
}

const ButtonAppBar = (props) => {

	return (
		<div className={props.classes.root}>
			<AppBar position="static" className={props.classes.appbar}>
				<Toolbar className={props.classes.toolbar}>
					<div className={props.classes.navsection}>

						<NavLink to="/" exact={true} activeClassName="active">
							<Button color="contrast">Home</Button>
						</NavLink>
						<NavLink to="/dest" exact={true} activeClassName="active">
							<Button color="contrast">Destination</Button>
						</NavLink>
						<NavLink to="/hotel" exact={true} activeClassName="active">
							<Button color="contrast">Hotel</Button>
						</NavLink>

					</div>
					<div className={props.classes.login}>
						{
							!props.me.looading && (
								props.me.fullName
									? <Me me={props.me} onLogout={props.onLogout}/>
									: <MyLogin handleOpenLoginDialog={props.handleOpenLoginDialog}/>
							)
						}
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}

ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
	me: PropTypes.object.isRequired,
	onLogout: PropTypes.func.isRequired,
	handleOpenLoginDialog: PropTypes.func.isRequired
};

const mapDispatchToProps = ({handleOpenLoginDialog: openLoginDialog})

// const ButtonAppBarBefore = withStyles(styles)(ButtonAppBar); export default
// withStyles(styles)(ButtonAppBar);

export default compose(withStyles(styles), connect(null, mapDispatchToProps))(
	ButtonAppBar
)
