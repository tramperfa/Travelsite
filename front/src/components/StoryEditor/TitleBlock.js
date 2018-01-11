import React, {Component} from 'react';
import styled from 'styled-components'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui-icons/Delete'
import Edit from 'material-ui-icons/Edit'

const ICONWIDTH = 48

export default class extends Component {
	state = {
		onHover: false
	}
	onMouseEnter = () => {
		this.setState({onHover: true})
	}

	onMouseLeave = () => {
		this.setState({onHover: false})
	}

	onEdit = (blockKey, entityKey, currentTitle) => {
		this.props.blockProps.openSubTitleEditor(blockKey, entityKey, currentTitle)
	}
	onDelete = (blockKey) => {
		this.props.blockProps.deleteBlock(blockKey)
	}

	render() {
		const contentState = this.props.contentState
		const block = this.props.block
		const entityKey = block.getEntityAt(0)
		const {title} = contentState.getEntity(entityKey).getData()
		return (
			<TitleBlock
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				style={{
					height: ICONWIDTH
				}}>
				<div>
					<a name={block.getKey()}></a>
					<h1 style={{
							margin: 0
						}}>
						{title}
					</h1>
				</div>
				{
					this.state.onHover && <TitleAction>
							<IconButton onClick={() => this.onEdit(block.getKey(), entityKey, title)}>
								<Edit/>
							</IconButton>
							<IconButton onClick={() => this.onDelete(block.getKey())}>
								<Delete/>
							</IconButton>
						</TitleAction>
				}
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
