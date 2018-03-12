import React from 'react'

import CONSTS from '../../../lib/consts'

const BUCKET_NAME = CONSTS.BUCKET_NAME

const CommentImage = ({imageData}) => {
	return (
		<img
			style={{
				width: imageData.size.width,
				height: imageData.size.height
			}}
			src={BUCKET_NAME + imageData.filename}
			alt=''/>
	)
}

export default CommentImage
