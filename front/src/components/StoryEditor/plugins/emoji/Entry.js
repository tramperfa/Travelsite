import React, {Component} from 'react'

export default class extends Component {

	render() {
		const {group, isActive} = this.props
		return (
			<div className={isActive
					? "navEntryActive"
					: "navEntry"}>
				<img className="emojiImg" src={group.img} alt=""/>
			</div>
		)
	}

}
