import {EmojiGroups} from '../components/StoryEditor/plugins/emoji/constants/EmojiGroups'

const getContentSnapshot = (content) => {
	let snapshot = ""

	for (let block of content.blocks) {
		if (block.type === 'unstyled' && block.text.length > 0) {
			let text = block.text
			for (let group of EmojiGroups) {
				for (let emoji of group.list) {
					let emojiString = "{" + emoji.name + "}"
					text = text.split(emojiString).join(' ')
				}
			}
			if (text.length > 0) {
				snapshot = snapshot + ' ' + text
			}
		}
		snapshot = snapshot.replace(/\s+/g, ' ')
		if (snapshot.length > 200) {
			break
		}
	}
	snapshot = snapshot.replace(/^\s+|\s+$/g, '')
	return snapshot
}

export default getContentSnapshot
