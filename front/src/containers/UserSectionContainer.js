import React, {Component} from 'react';
//import PropTypes from 'prop-types';
import {connect} from 'react-redux';
//
import {logoutUserInfo} from '../redux/actions';
import {resetApolloStore} from '../graphql/graphql';
import persist from '../lib/persist';

import UserSection from '../components/Header/UserSection';

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
		await this.props.logoutUserInfoDispatch()
		await persist.willRomveSessionUser()
		await resetApolloStore()
	}

	render() {
		return (
			<UserSection
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				menuOpen={this.state.menuOpen}
				handleUserLogout={this.handleUserLogout}/>
		)
	}
}

const mapDispatchToProps = ({logoutUserInfoDispatch: logoutUserInfo})

export default connect(null, mapDispatchToProps)(UserSectionContainer)
