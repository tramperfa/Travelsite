import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

//
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import {MenuItem, MenuList} from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import {withStyles} from 'material-ui/styles';
import {Manager, Target, Popper} from 'react-popper';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

const UserSection = ({
	menuOpen,
	onMouseEnter,
	onMouseLeave,
	classes,
	userLocalStoreState,
	handleUserLogout
}) => {
	return (
		<div onMouseLeave={onMouseLeave}>
			<Manager>
				<div onMouseEnter={onMouseEnter}>
					<Target>
						<Link className={classes.textField} to={`/user/${userLocalStoreState.me._id}`}>
							<Button
								aria-owns={menuOpen
									? 'menu-list'
									: null}
								aria-haspopup="true"
								color="contrast">
								{userLocalStoreState.me.fullName}
							</Button>
						</Link>
					</Target>
				</div>
				<div style={{
						display: menuOpen
							? 'block'
							: 'none'
					}}>
					<Popper
						style={{
							zIndex: 10
						}}
						placement="bottom-start"
						eventsEnabled={menuOpen}>

						<Grow
							in={menuOpen}
							id="menu-list"
							style={{
								transformOrigin: '0 0 0'
							}}>
							<Paper>
								<MenuList role="menu">
									<MenuItem>
										<Link className={classes.textField} to={`/user/${userLocalStoreState.me._id}`}>
											My Profile
										</Link>
									</MenuItem>
									<MenuItem>
										<Link className={classes.textField} to={`/my/draft`} target="_blank">
											Write a Story
										</Link>
									</MenuItem>
									<MenuItem>
										<Link className={classes.textField} to="/my/setting">
											My Settings
										</Link>
									</MenuItem>
									<MenuItem onClick={handleUserLogout}>
										<Link className={classes.textField} to="/">
											Logout
										</Link>
									</MenuItem>
								</MenuList>
							</Paper>
						</Grow>

					</Popper>
				</div>
			</Manager>
		</div>
	)
}

const mapStateToProps = (state) => (
	{userLocalStoreState: state.userLocalStore}
)

export default compose(withStyles(styles), connect(mapStateToProps, null))(
	UserSection
);

/* <Link className={classes.textField} to="/">
  <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
</Link> */
