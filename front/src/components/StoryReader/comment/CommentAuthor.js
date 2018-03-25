import React from 'react'
import {Link} from 'react-router-dom'

const CommentAuthor = ({author}) => {
	return (
		<Link className="storyListAuthor" to={`user/${author._id}`} target="_blank">
			{author.fullName}
		</Link>
	)
}

export default CommentAuthor
