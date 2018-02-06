import React from 'react';
//import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

//
const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200
	},
	menu: {
		width: 200
	}
});

const AuthDialog = ({
	classes,
	state,
	handleKeyPress,
	handleChange,
	handleSubmit,
	handleClose
}) => {

	return (
		<div>
			<DialogTitle>{"Login"}</DialogTitle>
			<form
				className={classes.container}
				noValidate="noValidate"
				autoComplete="off"
				onKeyPress={handleKeyPress}>
				<DialogContent>
					<TextField
						id="name"
						label="Email"
						className={classes.textField}
						value={state.name}
						onChange={handleChange('name')}
						margin="normal"/>
					<TextField
						id="password"
						label="Password"
						className={classes.textField}
						type="password"
						autoComplete="current-password"
						value={state.password}
						onChange={handleChange('password')}
						margin="normal"/>
				</DialogContent>
				<div style={{
						color: 'red'
					}}>
					{state.errorMessage}
				</div>
			</form>
			<DialogActions>
				<Button onClick={handleSubmit} color="primary">
					SUBMIT
				</Button>
				<Button onClick={handleClose} color="primary">
					CANCEL
				</Button>
			</DialogActions>
		</div>
	)
}

export default withStyles(styles)(AuthDialog)
