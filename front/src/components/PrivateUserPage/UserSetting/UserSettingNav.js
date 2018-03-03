import React from 'react'
import {NavLink} from 'react-router-dom'

const UserSettingNav = ({match}) => (

	<div className="userTabsBar">
		<div className="centerContainer">
			<div className="userTabs">
				<header className="user-header">
					<nav>
						<NavLink to={`${match.url}`} activeClassName="active">Home</NavLink>
						<NavLink to={`${match.url}/avatar`} activeClassName="active">Avatar</NavLink>
					</nav>
				</header>
			</div>
		</div>
	</div>
)

export default UserSettingNav
