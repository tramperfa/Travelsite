import React, {Component} from 'react'

import GroupsContainer from './GroupsContainer'
import Nav from './Nav'
export default class extends Component {
	state = {
		activeGroup: 0
	}

	onScroll = (activeGroup) => {
		this.setState({activeGroup: activeGroup})
	}

	onGroupSelect = (index) => {
		this.groups.scrollToGroup(index)
	}

	render() {
		return (
			<div className="emojiSelect">
				<GroupsContainer
					onScroll={this.onScroll}
					onEmojiClick={this.props.onEmojiClick}
					ref={(element) => {
						this.groups = element
					}}/>
				<Nav activeGroup={this.state.activeGroup} onGroupSelect={this.onGroupSelect}/>
			</div>
		)
	}
}
