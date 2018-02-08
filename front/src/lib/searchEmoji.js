import {EmojiGroups} from '../components/StoryEditor/plugins/emoji/constants/EmojiGroups'

const searchEmoji = (decoratedText) => {
	const emojiName = decoratedText.replace(/[{|}]/g, '')
	let matchedEmoji = []

	EmojiGroups.forEach((group) => {
		matchedEmoji = matchedEmoji.concat(group.list.filter((emoji) => {
			return emoji.name === emojiName
		}))
	})

	return matchedEmoji[0]
}

export default searchEmoji
