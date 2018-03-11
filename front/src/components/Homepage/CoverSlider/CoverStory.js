import React from 'react'
import {Link} from 'react-router-dom'

import CONSTS from '../../../lib/consts'

const CoverStory = ({story}) => {
	return (
		<Link to={`/story/${story._id}`}>
			<div style={{
					position: 'relative'
				}}>
				<img
					className="headlineImage"
					src={CONSTS.BUCKET_NAME + story.headlineImage.browserHeadlineImage.filename}
					alt=''/>
				<div className="coverStoryTitleContainer">
					<h3 className="coverStoryTitle">{story.title}</h3>
				</div>
			</div>
		</Link>
	)
}

export default CoverStory
