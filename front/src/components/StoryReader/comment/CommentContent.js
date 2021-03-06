import React from 'react'
import redraft from 'redraft'

import CONSTS from '../../../lib/consts'
import '../../BlockStyles.css'

import {emojiStrategy} from '../../StoryEditor/decorators/emojiStrategy'
import ReaderEmojiSpan from '../contentReader/ReaderEmojiSpan'

const timeReg = /[A-Z][a-z]+ \d{1,2} \d{4} \d{1,2}:\d{1,2}/
const BUCKET_NAME = CONSTS.BUCKET_NAME

const CommentContent = ({comment, quoteImage}) => {
	const {content, isReply, replyTo} = comment
	const converted = redraft(content, renderers)
	if (!converted) {
		return (<div>Error in content rendering</div>)
	}
	return (
		<div className="commentContentReader">
			{
				quoteImage && <div>
						<p className="commentQuote">
							Quote image:
						</p>
						<div>
							<img src={BUCKET_NAME + quoteImage.browserCommentImage.filename} alt=''/>
						</div>
					</div>
			}
			{
				isReply && <div className="commentQuote">
						<p>
							Quote {replyTo.authorName}'s comment published on {replyTo.publishTime.match(timeReg)[0]}
						</p>
						{
							redraft(replyTo.content, renderers).map(
								(element, index) => <div key={index}>
									{element.map((e, i) => <div key={i}>{e}</div>)}
								</div>
							)
						}

					</div>
			} {
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
