import React from 'react'

const timeReg = /[A-Z][a-z]+ \d{1,2} \d{4} \d{1,2}:\d{1,2}/

const CommentBottomVar = (
	{commentAuthor, publishTime, onReply, onDelete, MeData}
) => {
	const pTime = publishTime.match(timeReg)
	return (
		<div className="commentOtherInfo">
			<div className="commentQuote">
				{pTime[0]}
			</div>
			{
				MeData.userSelf && MeData.userSelf._id !== commentAuthor._id && <div className="commentReply" onClick={onReply}>
						Reply
					</div>
			}
			{
				MeData.userSelf && MeData.userSelf._id === commentAuthor._id && <div className="commentReply" onClick={onDelete}>
						Delete
					</div>
			}
		</div>
	)
}

export default CommentBottomVar
