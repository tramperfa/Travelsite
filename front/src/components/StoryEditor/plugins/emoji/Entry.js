import React, {Component} from 'react'

export default class extends Component {

	render() {
		const {group, isActive} = this.props
		return (
			<div
				className={isActive
					? "navEntryActive"
					: "navEntry"}
				onClick={() => {
					this.props.onGroupSelect(this.props.index)
				}}>
				<img className="emojiImg" src={group.img} alt=""/>
			</div>
		)
	}

}
