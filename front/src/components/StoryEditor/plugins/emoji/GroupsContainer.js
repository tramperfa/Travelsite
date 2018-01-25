import React, {Component} from 'react'
import {Scrollbars} from 'react-custom-scrollbars'

import {EmojiGroups} from './constants/EmojiGroups'
import Group from './Group'

export default class extends Component {
	onScroll = (values) => {
		const activeGroup = Math.trunc(values.top / 0.25)
		this.props.onScroll(activeGroup)
	}

	render() {
		return (
			<div>
				<Scrollbars style={{
						height: 224
					}} onScrollFrame={this.onScroll}>
					{
						EmojiGroups.map(
							(group) => (<Group key={group.title} groupTitle={group.title} emojiList={group.list}/>)
						)
					}
				</Scrollbars>
			</div>
		)
	}
}
