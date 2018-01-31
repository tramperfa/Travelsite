import React, {Component} from 'react'

import IconButton from 'material-ui/IconButton'
import Mood from 'material-ui-icons/Mood'

import EmojiSelect from '../plugins/emoji/EmojiSelect'

export default class extends Component {
	state = {
		active: false
	}

	onClick = () => {
		const active = !this.state.active
		this.setState({active: active})
	}

	onBlur = () => {
		console.log("Blur");
		this.setState({active: false})
	}

	render() {
		return (
			<div>
				<IconButton onClick={this.onClick}>
					<Mood/>
				</IconButton>
				{this.state.active && <EmojiSelect onEmojiClick={this.props.onEmojiClick}/>}
			</div>
		)
	}
}
