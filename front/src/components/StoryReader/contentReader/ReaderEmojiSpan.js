import React from 'react'
import searchEmoji from '../../../lib/searchEmoji'

// import {EmojiGroups} from
// '../../storyEditor/plugins/emoji/constants/EmojiGroups'

const ReaderEmojiSpan = (props) => {
	// const emojiName = props.decoratedText.replace(/[\{|\}]/g, '')
	let emoji = searchEmoji(props.decoratedText)
	return <span>
		<img src={emoji.img} alt=''/>
	</span>
}

export default ReaderEmojiSpan
