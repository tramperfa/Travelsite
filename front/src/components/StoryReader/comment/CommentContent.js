import React from 'react'
import redraft from 'redraft'

import CONSTS from '../../../lib/consts'
import '../../BlockStyles.css'

import {emojiStrategy} from '../../StoryEditor/decorators/emojiStrategy'
import ReaderEmojiSpan from '../contentReader/ReaderEmojiSpan'

const BUCKET_NAME = CONSTS.BUCKET_NAME

const CommentContent = ({comment, quoteImage}) => {
	const {content, isReply} = comment
	const quoteImageId = comment.quoteImage
	const converted = redraft(content, renderers)
	if (!converted) {
		return (<div>Error in content rendering</div>)
	}
	return (
		<div className="commentContentReader">
			{
				quoteImageId && <div>
						<p className="commentTime">
							Quote image:
						</p>
						<div>
							<img src={BUCKET_NAME + quoteImage.browserCommentImage.filename} alt=''/>
						</div>
					</div>
			}
			{
				converted.map(
					(element, index) => <div key={index}>
						{element.map((e, i) => <div key={i}>{e}</div>)}
					</div>
				)
			}
		</div>
	)
}

const renderers = {
	blocks: {
		unstyled: (children) => children.map(child => <p>{child}</p>)
	},
	decorators: [
		{
			strategy: emojiStrategy,
			component: ({children, decoratedText}) => <ReaderEmojiSpan
					key={decoratedText + Math.floor(Math.random() * 1000)}
					decoratedText={decoratedText}/>
		}
	]
}

export default CommentContent
