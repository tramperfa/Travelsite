import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

//
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Menu, {MenuItem} from 'material-ui/Menu';
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

const UserSection = ({
	onHover,
	onMouseEnter,
	onMouseLeave,
	classes,
	userLocalStoreState,
	handleUserLogout
}) => {
	return (
		//
		<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<Button
				aria-owns={onHover
					? 'simple-menu'
					: null}
				aria-haspopup="true"
				color="contrast">
				{userLocalStoreState.me.fullName}
			</Button>
			<Menu id="simple-menu"
				// anchorEl={this.state.anchorEl}
				open={onHover}>
				<MenuItem>
					<Link
						className={classes.textField}
						to={`/user/${userLocalStoreState.me._id}`}
						target="_blank">
						My Profile
					</Link>
				</MenuItem>
				<MenuItem>
					<Link className={classes.textField} to={`/mydraft`} target="_blank">
						Write a Story
					</Link>
				</MenuItem>
				<Link className={classes.textField} to="/">
					<MenuItem onClick={handleUserLogout}>Logout</MenuItem>
				</Link>
			</Menu>
		</div>
	)
}

const mapStateToProps = (state) => (
	{userLocalStoreState: state.userLocalStore}
)

export default compose(withStyles(styles), connect(mapStateToProps, null))(
	UserSection
);
