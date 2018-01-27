import React, {Component} from 'react'
import IconButton from 'material-ui/IconButton';
import Title from 'material-ui-icons/Title'

import AtomicInput from './AtomicInput'

const HINTTEXT = "Type a subtitle and press 'Enter'"

export default class extends Component {

	state = {
		addTitle: false,
		title: ""
	}

	onClick = () => {
		this.setState({addTitle: true})
	}

	onBlur = () => {
		if (this.props.editTitle) {
			this.props.closeSubTitleEditor()
		} else {
			this.setState({addTitle: false})
		}
	}

	onChange = (e) => {
		this.setState({title: e.target.value})
	}

	onKeyPress = (e) => {
		if (e.key === 'Enter') {
			const title = this.state.title
			if (this.props.editTitle) {
				this.props.updateSubTitle(title)
			} else {
				this.props.addSubTitleBlock(title)
			}
			this.onBlur()
		}
	}

	render() {
		return (
			<AtomicInput
				active={this.props.editTitle || this.state.addTitle}
				onBlur={this.onBlur}
				hintText={HINTTEXT}
				text={this.props.editTitle
					? this.props.currentTitle
					: undefined}
				onChange={this.onChange}
				onKeyPress={this.onKeyPress}>
				<IconButton onClick={this.onClick}>
					<Title/>
				</IconButton>
			</AtomicInput>

		)
	}
}
