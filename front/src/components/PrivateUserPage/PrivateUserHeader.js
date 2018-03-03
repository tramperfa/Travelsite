import React from 'react'
import {NavLink} from 'react-router-dom'

const PrivateUserHeader = ({match}) => (

	<div className="userTabsBar">
		<div className="centerContainer">
			<div className="userTabs">
				<header className="user-header">
					<nav>
						<NavLink to={`${match.url}/draft`} activeClassName="active">My Drafts</NavLink>
						<NavLink to={`${match.url}/setting`} activeClassName="active">My Settings</NavLink>
						<NavLink to={`${match.url}/storydelete`} activeClassName="active">My Deleted Stories</NavLink>
					</nav>
				</header>
			</div>
		</div>
	</div>
)

export default PrivateUserHeader
