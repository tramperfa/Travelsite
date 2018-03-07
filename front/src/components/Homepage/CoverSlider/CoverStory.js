import React from 'react'

import CONSTS from '../../../lib/consts'

const CoverStory = ({story}) => {
	return (
		<div>
			<img
				className="headlineImage"
				src={CONSTS.BUCKET_NAME + story.headlineImage.browserHeadlineImage.filename}
				alt=''/>
		</div>
	)
}

export default CoverStory
