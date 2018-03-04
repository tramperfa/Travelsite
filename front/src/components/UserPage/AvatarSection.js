import React from 'react'
import {Link} from 'react-router-dom'

import PhotoCamera from 'material-ui-icons/PhotoCamera'
import CONSTS from '../../lib/consts'

import DefaultAvatar from '../../images/defaultAvatar.jpg'

const AvatarSection = ({user}) => {
	const avatarImg = user.avatar === null
		? DefaultAvatar
		: CONSTS.BUCKET_NAME + user.avatar.avatar124px.filename
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
