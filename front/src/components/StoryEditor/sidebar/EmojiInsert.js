import React, {Component} from 'react'
import Loadable from 'react-loadable';

import IconButton from 'material-ui/IconButton'
import Mood from 'material-ui-icons/Mood'

//import EmojiSelect from '../plugins/emoji/EmojiSelect'
import Loading from '../../../lib/LoadingSplitCode';

const LoadableEmojiSelect = Loadable({
	loader: () => import (/* webpackChunkName: 'Editor_Emoji' */
	'../plugins/emoji/EmojiSelect'),
	loading: Loading,
	delay: 1000
})

export default class extends Component {
	state = {
		active: false
	}

	onClick = () => {
		const active = !this.state.active
		this.setState({active: active})
	}

	onEmojiClick = (emoji) => {
		this.props.onEmojiClick(emoji)
		this.setState({active: false})
	}

	render() {
		return (
			<div>
				<IconButton onClick={this.onClick}>
					<Mood/>
				</IconButton>
				{this.state.active && <LoadableEmojiSelect onEmojiClick={this.onEmojiClick}/>}
			</div>
		)
	}
}
