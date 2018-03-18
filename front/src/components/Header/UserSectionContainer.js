import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

//
import {logoutUserInfo} from '../../redux/actions';
import {resetApolloStore} from '../../graphql/graphql';
import {WithUserSelfAvatarQuery, WithLogoutMutation} from '../../graphql/user';
import {ComposeQuery} from '../../lib/hoc';
import persist from '../../lib/persist';

import UserSection from './UserSection';

class UserSectionContainer extends Component {
	state = {
		menuOpen: false
	}
	onMouseEnter = () => {
		//console.log("Mouse enter");
		this.setState({menuOpen: true})
	}
	onMouseLeave = () => {
		//console.log("Mouse leave");
		this.setState({menuOpen: false})
	}

	handleUserLogout = async () => {
		await this.props.logout()
		await persist.willRomveSessionUser()
		await this.props.logoutUserInfoDispatch()
		await resetApolloStore()
	}

	render() {
		return (
			<UserSection
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				menuOpen={this.state.menuOpen}
				handleUserLogout={this.handleUserLogout}
				MeData={this.props.MeData}/>
		)
	}
}

UserSectionContainer.propTypes = {
	logout: PropTypes.func.isRequired,
	MeData: PropTypes.object.isRequired
}

const mapDispatchToProps = ({logoutUserInfoDispatch: logoutUserInfo})

const UserSectionContainerWithComposeQuery = ComposeQuery(
	UserSectionContainer,
	'MeData'
)

export default compose(
	connect(null, mapDispatchToProps),
	WithLogoutMutation,
	WithUserSelfAvatarQuery
)(UserSectionContainerWithComposeQuery)
