import React, {Component} from 'react'

export default class extends Component {
	render() {
		const {emoji, onEmojiClick} = this.props
		return (
			<div className="emoji" onClick={() => {
					onEmojiClick(emoji.name)
				}}>
				<img className="emojiImg" src={emoji.img} alt=""/>
			</div>
		)
	}
}
