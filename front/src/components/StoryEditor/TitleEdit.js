import React, {Component} from 'react'
// import ReactDOM from 'react-dom' import Immutable from 'immutable' import
// {EditorState, Modifier} from 'draft-js'
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui-icons/Edit'

import AtomicInput from './AtomicInput'

const HINTTEXT = "Update this subtitle and press 'Enter'"

export default class extends Component {
	state = {
		active: false,
		title: this.props.title
	}

	onClick = () => {
		this.setState({active: true})
	}

	onBlur = () => {
		this.setState({active: false, title: this.props.title})
	}

	onChange = (e) => {
		this.setState({title: e.target.value})
	}

	onKeyPress = (e) => {
		if (e.key === 'Enter') {
			const title = this.state.title
			this.onBlur()
			console.log(title);
			// this.props.addSubTitleBlock(title)
		}
	}

	render() {
		return (
			<AtomicInput
				active={this.state.active}
				onBlur={this.onBlur}
				hintText={HINTTEXT}
				text={this.state.title}
				onChange={this.onChange}
				onKeyPress={this.onKeyPress}>
				<IconButton onClick={this.onClick}>
					<Edit/>
				</IconButton>
			</AtomicInput>

		)
	}
}
