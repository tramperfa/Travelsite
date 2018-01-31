const EMOJI_REGEX = /\{(Activity|Animal|Food|People|Travel)\[([0-2]?\d)\]\}/g

export function emojiStrategy(contentBlock, callback, contentState) {
	const text = contentBlock.getText()
	let match
	while ((match = EMOJI_REGEX.exec(text)) !== null) {
		let start = match.index
		callback(start, start + match[0].length)
	}
}
