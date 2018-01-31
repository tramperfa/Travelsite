import {CompositeDecorator} from "draft-js"

import {emojiStrategy} from './emojiStrategy'
import {EmojiSpan} from './EmojiSpan'

export const defaultDecorator = new CompositeDecorator([
	{
		strategy: emojiStrategy,
		component: EmojiSpan
	}
])
