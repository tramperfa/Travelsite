import React from 'react';
import Button from 'material-ui/Button';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

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
})

const Signup = ({classes, state, handleChange, handleSubmit, handleSwitch}) => {
	return (
		<div>
			<form className={classes.container} noValidate="noValidate" autoComplete="off">
				<TextField
					required={true}
					id="username"
					label="Username"
					className={classes.textField}
					value={state.name}
					onChange={handleChange('username')}
					margin="normal"/>
				<TextField
					required={true}
					id="displayname"
					label="Displayname"
					className={classes.textField}
					value={state.name}
					onChange={handleChange('displayname')}
					margin="normal"/>
				<TextField
					required={true}
					id="email"
					label="Email"
					className={classes.textField}
					value={state.name}
					onChange={handleChange('email')}
					margin="normal"/>
				<TextField
					required={true}
					id="password"
					label="Password"
					className={classes.textField}
					type="password"
					autoComplete="current-password"
					value={state.password}
					onChange={handleChange('password')}
					margin="normal"/> {/* <div style={{
						color: 'red'
					}}>
					{state.errorMessage}
				</div> */
				}
			</form>
			<Button onClick={handleSubmit} color="primary">
				SUBMIT
			</Button>
			<Button onClick={handleSwitch} color="primary">
				SIGNIN
			</Button>
		</div>
	)
}

export default withStyles(styles)(Signup)

// import createHistory from 'history/createBrowserHistory' const history =
// createHistory()