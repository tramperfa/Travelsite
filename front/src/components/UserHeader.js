import React from 'react'
import {NavLink} from 'react-router-dom'

const UserHeader = ({match}) => (

  <header className="user-header">
    <nav>
      <NavLink to={`${match.url}`} exact activeClassName="active">My Home</NavLink>
      <NavLink to={`${match.url}/story`} activeClassName="active">My Story</NavLink>
      <NavLink to={`${match.url}/review`} activeClassName="active">My Review</NavLink>
      <NavLink to={`${match.url}/archive`} activeClassName="active">My Archive</NavLink>
    </nav>
  </header>
)

export default UserHeader
