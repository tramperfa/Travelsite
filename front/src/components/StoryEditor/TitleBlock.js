import React, {Component} from 'react';
import styled from 'styled-components'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui-icons/Delete'
import Edit from 'material-ui-icons/Edit'

export default class extends Component {
	onMouseEnter = () => {
		// console.log("Mouse Enter!")
	}

	onMouseLeave = () => {
		// console.log("Mouse Leave!")
	}
	onEdit = (entityKey, currentTitle) => {
		this.props.blockProps.openSubTitleEditor(entityKey, currentTitle)
	}

	render() {
		const contentState = this.props.contentState
		const block = this.props.block
		const entityKey = block.getEntityAt(0)
		const {title} = contentState.getEntity(entityKey).getData()
		return (
			<TitleBlock onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				<div>
					<a name={block.getKey()}></a>
					<h1 style={{
							margin: 0
						}}>
						{title}
					</h1>
				</div>
				<TitleAction>
					<IconButton onClick={() => this.onEdit(entityKey, title)}>
						<Edit/>
					</IconButton>
					<IconButton>
						<Delete/>
					</IconButton>
				</TitleAction>
			</TitleBlock>
		)
	}
}

const TitleBlock = styled.div `
  width: 100%;
  background: #e4f0f5;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`
const TitleAction = styled.div `
	display: flex;
	align-items: center;
  flex-direction: row;
  justify-content: flex-end;
`
