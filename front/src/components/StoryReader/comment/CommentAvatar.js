import React from 'react'
import {Link} from 'react-router-dom'

import CONSTS from '../../../lib/consts'
import DefaultAvatar from '../../../images/defaultAvatar.jpg'

const CommentAvatar = ({user}) => {
	const avatarImg = user.avatar
		? CONSTS.BUCKET_NAME + user.avatar.avatar48px.filename
		: DefaultAvatar
	return (
		<div style={{
				position: 'absolute',
				top: 0,
				left: 0
			}}>
			<Link to={`/user/${user._id}`} target="_blank">
				<img className="commentAvatar" src={avatarImg} alt=''/>
			</Link>
		</div>
	)
}

export default CommentAvatar
