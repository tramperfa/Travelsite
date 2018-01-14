import React, {Component} from "react"

import BlockAction from "./BlockAction"

export default class BlockActionGroup extends Component {

	renderItem(item) {
		return (<BlockAction item={item} key={item.key}/>);
	}

	render() {
		return (
			<div className="atomicActionGroup">
				{this.props.items.map(this.renderItem)}
			</div>
		)
	}

}
