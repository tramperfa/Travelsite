import React from 'react'

import Movie from 'material-ui-icons/Movie'
import TextItem from './TextItem'

const ListItem = ({block, isDragging}) => {
	const style = isDragging
		? {
			border: '2px solid #6384D1'
		}
		: {}
	return (
		<div className='dndItem' style={style}>
			{block.type === 'image' && <img className='dndImg' src={block.src} alt=''/>}
			{block.type === 'video' && <Movie/>}
			{block.type === 'unstyled' && <TextItem content={block.content}/>}
		</div>
	)
}

export default ListItem
