import React from 'react'

import {Draggable} from 'react-beautiful-dnd'

import BlockList from './BlockList'

const ParagraphGroup = ({index, group}) => {
	const {key, title, blocks} = group
	return (
		<Draggable key={key} draggableId={key} index={index}>
			{
				(provided, snapshot) => (
					<div className="paragraphGroupsHeader">
						<div
							className="paragraphWrapper"
							ref={provided.innerRef}
							{...provided.draggableProps}>
							<div>
								<h4 {...provided.dragHandleProps}>
									{title}
								</h4>
							</div>
							<BlockList groupKey={key} blocks={blocks}/>
						</div>
						{provided.placeholder}
					</div>
				)
			}
		</Draggable>
	)
}

export default ParagraphGroup
