import React, {Component} from "react"

export default class BlockWrapper extends Component {
	render() {
		return (
			<div
				style={this.props.style}
				onMouseEnter={this.props.onMouseEnter}
				onMouseLeave={this.props.onMouseLeave}>
				{this.props.children}
			</div>
		)
	}
}
