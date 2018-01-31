import React, {Component} from 'react'
import {Scrollbars} from 'react-custom-scrollbars'

import {EmojiGroups} from './constants/EmojiGroups'
import Group from './Group'

export default class extends Component {

	scrollToGroup = (index) => {
		this.scrollbars.scrollTop(
			(index / EmojiGroups.length) * this.scrollbars.getScrollHeight()
		)
	}

	onScroll = (values) => {
		const activeGroup = Math.trunc(values.top * (EmojiGroups.length - 1))
		this.props.onScroll(activeGroup)
	}

	render() {
		return (
			<div>
				<Scrollbars
					style={{
						height: 224
					}}
					onScrollFrame={this.onScroll}
					ref={(element) => {
						this.scrollbars = element
					}}>
					{
						EmojiGroups.map((group) => (
							<Group
								key={group.title}
								groupTitle={group.title}
								emojiList={group.list}
								onEmojiClick={this.props.onEmojiClick}/>
						))
					}
				</Scrollbars>
			</div>
		)
	}
}
