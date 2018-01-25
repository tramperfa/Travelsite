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

	render() {
		return (
			<div className="emojiSelect">
				<GroupsContainer onScroll={this.onScroll}/>
				<Nav activeGroup={this.state.activeGroup}/>
			</div>
		)
	}
}
