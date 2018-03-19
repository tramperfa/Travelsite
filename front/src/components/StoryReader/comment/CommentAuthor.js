import React from 'react'
import {Link} from 'react-router-dom'

const CommentAuthor = ({author}) => {
	return (
		<Link className="storyListAuthor" to={`user/${author}`} target="_blank">
			{author}
		</Link>
	)
}

export default CommentAuthor
