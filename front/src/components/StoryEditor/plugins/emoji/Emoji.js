import React, {Component} from 'react'

export default class extends Component {
	render() {
		return (
			<div className="emoji" onClick={this.props.onClick}>
				<img className="emojiImg" src={this.props.img} alt=""/>
			</div>
		)
	}
}