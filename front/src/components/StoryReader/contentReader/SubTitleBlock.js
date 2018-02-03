import React from 'react'

const SubTitleBlock = ({title, blockKey}) => {
	return (
		<div className="atomicReader">
			<div className="subTitleContent">
				<a name={blockKey} style={{
						opacity: 0
					}}>#</a>
				<h1 className="h1">
					{title}
				</h1>
			</div>
		</div>
	)
}

export default SubTitleBlock
