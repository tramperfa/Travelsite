import React from 'react';
import {Link} from 'react-router-dom';

import CONSTS from '../../lib/consts'
import DefaultAvatar from '../../images/defaultAvatar.jpg'

const AuthorAvatar = ({author}) => {
	const avatarImg = author.avatar
		? CONSTS.BUCKET_NAME + author.avatar.avatar124px.filename
		: DefaultAvatar
	return (
		<div className="storyAuthorAvatar">
			<Link to={`/user/${author._id}`} target="_blank">
				<img className="avatarCircle" src={avatarImg} alt=''/>
			</Link>
		</div>
	)
}

export default AuthorAvatar
