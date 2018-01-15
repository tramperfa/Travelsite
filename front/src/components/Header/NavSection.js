import React from 'react';
import {NavLink} from 'react-router-dom';
import Button from 'material-ui/Button';
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
	navsection: {
		flex: 'auto',
		justifyContent: 'flex-start'
	}
});

const NavSection = ({classes}) => {

	return (
		<div className={classes.navsection}>
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
	)
}

export default withStyles(styles)(NavSection)
