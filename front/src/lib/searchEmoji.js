import {EmojiGroups} from '../components/StoryEditor/plugins/emoji/constants/EmojiGroups'

const searchEmoji = (decoratedText) => {
	const emojiName = decoratedText.replace(/[{|}]/g, '')
	let matchedEmoji
	EmojiGroups.map((group) => {
		group.list.map((emoji) => {
			if (emoji.name === emojiName) {
				matchedEmoji = emoji
			}
		})
	})
	return matchedEmoji
}

export default searchEmoji
