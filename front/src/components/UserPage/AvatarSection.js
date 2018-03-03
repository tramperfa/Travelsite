import React from 'react'
import {Link} from 'react-router-dom'

import PhotoCamera from 'material-ui-icons/PhotoCamera'

import DefaultAvatar from '../../images/defaultAvatar.jpg'
import SettingAvatar from './SettingAvatar'

const AvatarSection = ({user, match}) => {
	const avatarImg = user.avatar === null
		? DefaultAvatar
		: DefaultAvatar
	return (
		<div className="homeAvatar">
			<div className="avatar">
				<div className="avatarContainer">
					<Link to={`/my/setting/avatar`}>
						<img className="avatarCircle" src={avatarImg} alt=''/>
						<div className="avatarLinkIcon">
							<PhotoCamera/>
						</div>
					</Link>
				</div>
			</div>
			<div className="userName">{user.fullName}</div>
		</div>
	)
}

export default AvatarSection
