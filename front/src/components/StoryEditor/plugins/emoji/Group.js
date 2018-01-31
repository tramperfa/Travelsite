import React, {Component} from 'react'

import Emoji from './Emoji'

export default class extends Component {
	render() {
		const {groupTitle, emojiList, onEmojiClick} = this.props
		return (
			<div>
				<h3 className="emojiGroupTitle">{groupTitle}</h3>
				<div className="emojiGroup">
					{
						emojiList.map((emoji, index) => (
							<Emoji
								key={groupTitle + "_" + index}
								img={emoji}
								onClick={() => {
									// console.log(groupTitle + "_" + index + " is clicked");
									onEmojiClick(groupTitle, index)
								}}/>
						))
					}
				</div>
			</div>
		)
	}
}
