import React, {Component} from 'react'

export default class BlockAction extends Component {

	render() {
		const Icon = this.props.item.icon;
		return (
			<div className="atomicActionItem" onClick={this.props.item.action}>
				<Icon/>
			</div>
		)
	}
}
