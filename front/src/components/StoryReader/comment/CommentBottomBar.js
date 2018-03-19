import React from 'react'

const CommentBottomVar = ({publishTime, onReply}) => {
	return (
		<div className="commentOtherInfo">
			<div className="commentTime">
				{publishTime}
			</div>
			<div className="commentReply" onClick={onReply}>
				Reply
			</div>
		</div>
	)
}

export default CommentBottomVar
