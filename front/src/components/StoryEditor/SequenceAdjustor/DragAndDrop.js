import React, {Component} from 'react'
import {DragDropContext, Droppable} from 'react-beautiful-dnd'
import {List, Map} from 'immutable'
import {
	genKey,
	EditorState,
	ContentState,
	convertToRaw,
	ContentBlock,
	Modifier,
	BlockMapBuilder
} from "draft-js"

import ParagraphGroup from './ParagraphGroup'

const reorderGroup = (groups, fromIndex, toIndex) => {
	const [removed] = groups.splice(fromIndex, 1)
	groups.splice(toIndex, 0, removed)
	return groups
}

const reorderList = (fromList, fromIndex, toList, toIndex) => {
	const [removed] = fromList.splice(fromIndex, 1)
	toList.splice(toIndex, 0, removed)
	return {fromList: fromList, toList: toList}
}

const group2ContentState = (origContentState, paragraphGroups) => {
	let contentBlockArray = []
	for (let index in paragraphGroups) {
		const group = paragraphGroups[index]
		if (group.key !== 'empty') {
			contentBlockArray.push(
				new ContentBlock({key: genKey(), type: "unstyled", text: "", characterList: List()})
			)
			contentBlockArray.push(origContentState.getBlockForKey(group.key))
			contentBlockArray.push(
				new ContentBlock({key: genKey(), type: "unstyled", text: "", characterList: List()})
			)
		}
		for (let block of group.blocks) {
			if (block.type !== 'unstyled') {
				contentBlockArray.push(
					new ContentBlock({key: genKey(), type: "unstyled", text: "", characterList: List()})
				)
				contentBlockArray.push(origContentState.getBlockForKey(block.key))
				contentBlockArray.push(
					new ContentBlock({key: genKey(), type: "unstyled", text: "", characterList: List()})
				)
			} else {
				for (let line of block.content) {
					contentBlockArray.push(origContentState.getBlockForKey(line.key))
				}
			}
		}
	}
	const newContentState = ContentState.createFromBlockArray(contentBlockArray)
	console.log(convertToRaw(newContentState));
	return newContentState
}

export default class DragAndDrop extends Component {
	constructor(props) {
		super(props)
		this.state = {
			paragraphGroups: this.props.paragraphGroups
		}
	}

	onDragEnd = (result) => {
		if (!result.destination) {
			return
		}
		// console.log(result);
		const {source, destination} = result
		if (result.type === 'GROUP') {
			const newGroups = reorderGroup(
				this.state.paragraphGroups,
				source.index,
				destination.index
			)
			this.setState({paragraphGroups: newGroups})
		} else {
			const groups = this.state.paragraphGroups
			const fromList = groups.filter((group) => group.key === source.droppableId)
			const toList = groups.filter((group) => group.key === destination.droppableId)
			const afterReorder = reorderList(
				fromList[0].blocks,
				source.index,
				toList[0].blocks,
				destination.index
			)
			const newParagraphGroups = groups.map((group) => {
				if (group.key === destination.droppableId) {
					return {key: group.key, title: group.title, blocks: afterReorder.toList}
				} else if (group.key === source.droppableId) {
					return {key: group.key, title: group.title, blocks: afterReorder.fromList}
				}
				return group
			})
			// console.log(newParagraphGroups);
			this.setState({paragraphGroups: newParagraphGroups})
		}
	}

	onConfirm = () => {
		const newContentState = group2ContentState(
			this.props.origContentState,
			this.state.paragraphGroups
		)
		this.props.updateEditor(newContentState)
	}

	render() {
		return (
			<DragDropContext onDragEnd={this.onDragEnd}>
				<Droppable droppableId="droppable" direction="horizontal" type="GROUP">
					{
						(provided) => (
							<div className="paragraphGroupsWrapper" ref={provided.innerRef}>
								{
									this.state.paragraphGroups.map(
										(group, index) => (<ParagraphGroup key={group.key} index={index} group={group}/>)
									)
								}
								{provided.placeholder}
							</div>
						)
					}
				</Droppable>
			</DragDropContext>
		)
	}
}
