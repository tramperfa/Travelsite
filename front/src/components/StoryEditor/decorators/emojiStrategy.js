// import {EmojiGroups} from '../plugins/emoji/constants/EmojiGroups'
import searchEmoji from '../../../lib/searchEmoji'
// const EMOJI_REGEX = /\{(Activity|Animal|Food|People|Travel)\[([0-2]?\d)\]\}/g
const EMOJI_REGEX = /\{[(a-z)|\-| ]+\}/g

export function emojiStrategy(contentBlock, callback, contentState) {
	const text = contentBlock.getText()
	let match
	while ((match = EMOJI_REGEX.exec(text)) !== null) {
		let start = match.index
		const emoji = searchEmoji(match[0])
		if (emoji) {
			callback(start, start + match[0].length)
		}
	}
}
