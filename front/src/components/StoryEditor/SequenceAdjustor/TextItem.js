import React from 'react'

import FormatAlignLeft from 'material-ui-icons/FormatAlignLeft'

const TextItem = ({content}) => {
	return (
		<div className="textItemWrapper">
			<FormatAlignLeft/>
			<div className="textItemContent">
				{content.map((line) => (<div key={line.key}>{line.text}</div>))}
			</div>
		</div>
	)
}

export default TextItem
