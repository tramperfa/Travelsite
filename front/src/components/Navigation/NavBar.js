import React, {Component} from 'react';
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
import {openLoginDialog, logoutMe, loadMe} from '../../redux/actions';
import persist from '../../lib/persist';
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

//const NavBar = (props) => {

class NavBar extends Component {

	componentDidMount() {
		persist.willGetSessionUser().then((value) => {
			this.props.loadMe(value)
// console.log(value); console.log("AAAAA"); console.log(this.props.me);
		})
	}

	render() {
		return (

			<div className={this.props.classes.root}>
				<AppBar position="static" className={this.props.classes.appbar}>
					<Toolbar className={this.props.classes.toolbar}>
						<div className={this.props.classes.navsection}>

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
						<div className={this.props.classes.login}>
							{
								!this.props.me.loading && (
									this.props.me.me && this.props.me.me.fullName
										? <Me me={this.props.me.me} onLogout={this.props.handleLogout}/>
										: <MyLogin handleOpenLoginDialog={this.props.handleOpenLoginDialog}/>
								)
							}
						</div>
					</Toolbar>
				</AppBar>
			</div>
		);
		//
	}

}

NavBar.propTypes = {
	classes: PropTypes.object.isRequired,
	me: PropTypes.object.isRequired,
	handleLogout: PropTypes.func.isRequired,
	handleOpenLoginDialog: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({me: state.auth})

const mapDispatchToProps = (
	{handleOpenLoginDialog: openLoginDialog, handleLogout: logoutMe, loadMe: loadMe}
)

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(NavBar)
