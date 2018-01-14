import React from 'react';
import {graphql} from 'react-apollo';
import PropTypes from 'prop-types';
import {MenuItem} from 'material-ui/Menu';

//
import persist from '../../lib/persist';
import {LOGOUT_MUTATION} from '../../graphql/user';
import {resetApolloStore} from '../../graphql/graphql';

class Logout extends React.Component {

	handleLogout = async () => {
		try {
			await this.props.logout()
			await persist.willRomveSessionUser()
			await this.props.onLogout()
			await resetApolloStore()
		} catch (e) {
			console.log('there was an error during logout', e);
			console.log(JSON.stringify(e));
		} finally {}
	}

	render() {
		return (
			<div>
				{/* <Typography color="accent">
          Hello, {this.props.me.fullName}
        </Typography> */
				}
				<MenuItem onClick={this.handleLogout.bind(this)}>Logout</MenuItem>

			</div>

		)
	}

}

Logout.propTypes = {
	logout: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired
}

export default graphql(LOGOUT_MUTATION, {
	props: ({mutate}) => ({
		logout: () => mutate()
	})
})(Logout)
