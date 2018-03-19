import React from 'react'
import redraft from 'redraft'

import '../../BlockStyles.css'

import {emojiStrategy} from '../../StoryEditor/decorators/emojiStrategy'
import ReaderEmojiSpan from '../contentReader/ReaderEmojiSpan'

const CommentContent = ({commentContent}) => {
	const converted = redraft(commentContent, renderers)
	if (!converted) {
		return (<div>Error in content rendering</div>)
	}
	return (
		<div className="commentContentReader">
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
