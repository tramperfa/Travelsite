import React from 'react'

import CONSTS from '../../../lib/consts'

const VIDEO_WIDTH = CONSTS.DRAFT_WIDTH
const VIDEO_HEIGHT = VIDEO_WIDTH * 9 / 16

const RE_ID = /(\w+)$/

const VideoBlock = ({src}) => {
	const videoId = src.match(RE_ID)
	return (
		<div className="atomicReader">
			<iframe
				title={videoId[0]}
				width={VIDEO_WIDTH}
				height={VIDEO_HEIGHT}
				frameBorder="0"
				allowFullScreen="true"
				src={src}/>
		</div>
	)

}
export default VideoBlock
