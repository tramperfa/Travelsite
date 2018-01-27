import React, {Component} from 'react'
import CommonBlock from '../../atomicblock/CommonBlock'
import BlockContent from '../../atomicblock/BlockContent'
import Delete from 'material-ui-icons/Delete'
import Edit from 'material-ui-icons/Edit'

export default class SubTitleBlock extends Component {
	constructor(props) {
		super(props)
		this.actions = [
			{
				"key": "edit",
				"icon": Edit,
				"action": this.props.container.edit
			}, {
				"key": "delete",
				"icon": Delete,
				"action": this.props.container.remove
			}
		]
	}

	render() {
		const blockKey = this.props.blockKey
		return (
			<CommonBlock {...this.props} actions={this.actions}>
				<BlockContent>
					<div className="subTitleContent">
						<a name={blockKey} style={{
								opacity: 0
							}}>#</a>
						<h1 className="h1">
							{this.props.data.title}
						</h1>
					</div>
				</BlockContent>
			</CommonBlock>
		)
	}
}
