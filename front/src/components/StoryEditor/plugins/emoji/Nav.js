import React, {Component} from 'react'

import {EmojiGroups} from './constants/EmojiGroups'
import Entry from './Entry'

export default class extends Component {
	render() {

		return (
			<div className="emojiNavBar">
				{
					EmojiGroups.map((group, index) => (
						<Entry
							key={group.title + "_" + index}
							group={group}
							isActive={index === this.props.activeGroup}/>
					))
				}
			</div>
		)
	}

}
