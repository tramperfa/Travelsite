import React from 'react'

// import {EmojiGroups} from '../plugins/emoji/constants/EmojiGroups'
//
// const GROUP_REX = /[A-Z][a-z]+/ const INDEX_REX = /\d+/

export const EmojiSpan = (props) => {
	// const group = props.decoratedText.match(GROUP_REX) const index =
	// props.decoratedText.match(INDEX_REX) const emojiGroup =
	// EmojiGroups.filter((i) => { 	return i.title === group[0] }) const emojiImg =
	// emojiGroup[0].list[index[0]]
	return <span style={{
			background: "#ffe6e6"
		}}>
		{props.children}
	</span>
}
