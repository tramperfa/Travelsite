import React from 'react'

import DefaultAvatar from '../../images/defaultAvatar.jpg'
import CONSTS from '../../lib/consts'

const HeaderUserAvatar = ({user}) => {
	const avatarImg = !user || !user.avatar
		? DefaultAvatar
		: CONSTS.BUCKET_NAME + user.avatar.avatar20px.filename
	return (
		<div className="headlineAvatar">
			<img className="headlineAvatarImg" src={avatarImg} alt=''/>
		</div>
	)
}

export default HeaderUserAvatar
