import React from 'react'
import {NavLink} from 'react-router-dom'

const UserHeader = ({match}) => (

	<div className="userTabsBar">
		<div className="centerContainer">
			<div className="userTabs">
				<header className="user-header">
					<nav>
						<NavLink to={`${match.url}`} exact={true} activeClassName="active">My Home</NavLink>
						<NavLink to={`${match.url}/story`} activeClassName="active">My Story</NavLink>
						<NavLink to={`${match.url}/review`} activeClassName="active">My Review</NavLink>
						<NavLink to={`${match.url}/archive`} activeClassName="active">My Archive</NavLink>
					</nav>
				</header>
			</div>
		</div>
	</div>
)

export default UserHeader
