import React from 'react'
import {Link} from 'react-router-dom'
import DefaultAvatar from '../../images/defaultAvatar.jpg'
import CONSTS from '../../lib/consts'

const StoryListAuthor = ({author}) => {
	// console.log(author);
	const avatarImg = author.avatar === null || author.avatar === undefined
		? DefaultAvatar
		: CONSTS.BUCKET_NAME + author.avatar.avatar20px.filename
	return (
		<Link className="storyListAuthor" to={`user/${author._id}`} target="_blank">
			<div style={{
					display: 'flex',
					alignItems: 'center'
				}}>
				<img className="storyListAuthorAvatar" src={avatarImg} alt=''/>
				<div>{author.fullName}</div>
			</div>
		</Link>
	)
}

export default StoryListAuthor
