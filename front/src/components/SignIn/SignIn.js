import React from 'react';
import Button from 'material-ui/Button';
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

const SignIn = ({classes, state, handleKeyPress, handleChange, handleSubmit}) => {

	return (
		<div>
			<form
				className={classes.container}
				noValidate="noValidate"
				autoComplete="off"
				onKeyPress={handleKeyPress}>
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
			</form>
			<div style={{
					color: 'red'
				}}>
				{state.errorMessage}
			</div>
			<Button onClick={handleSubmit} color="primary">
				SUBMIT
			</Button>
		</div>
	)
}

export default withStyles(styles)(SignIn)
