import React from 'react'
import {Droppable, Draggable} from 'react-beautiful-dnd'

import ListItem from './ListItem'

const BlockList = ({groupKey, blocks}) => {
	return (
		<Droppable droppableId={groupKey} type="LIST">
			{
				(provided, snapshot) => (
					<div>
						<div className="blockListWrapper">
							<div className="blockList" ref={provided.innerRef}>
								<div>
									{
										blocks.map((block, index) => (
											<Draggable key={block.key} draggableId={block.key} index={index}>
												{
													(dragProvided, dragSnapshot) => (
														<div>
															<div
																ref={dragProvided.innerRef}
																{...dragProvided.draggableProps}
																{...dragProvided.dragHandleProps}>
																<ListItem block={block} isDragging={dragSnapshot.isDragging}/>
															</div>
															{dragProvided.placeholder}
														</div>
													)
												}
											</Draggable>
										))
									}
								</div>
								{provided.placeholder}
							</div>
						</div>
					</div>
				)

			}
		</Droppable>
	)
}

export default BlockList
