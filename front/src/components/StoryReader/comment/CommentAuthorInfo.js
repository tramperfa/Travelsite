import React from 'react'

import '../../BlockStyles.css'

import CommentAvatar from './CommentAvatar'
import CommentAuthor from './CommentAuthor'

const CommentAuthorInfo = ({author}) => {
	return (
		<div className="CommentAuthorInfo">
			<CommentAvatar user={author}/>
			<div className="commentAuthor">
				<CommentAuthor author={author}/>
			</div>
		</div>
	)
}

export default CommentAuthorInfo
