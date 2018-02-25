import React from 'react'
import IconButton from 'material-ui/IconButton'
import KeyboardArrowUp from 'material-ui-icons/KeyboardArrowUp'
import KeyboardArrowDown from 'material-ui-icons/KeyboardArrowDown'

const scrollToTop = () => {
	window.scrollTo(0, 0)
}

const scrollBottom = () => {
	window.scrollTo(0, document.body.scrollHeight)
}

const ScrollTools = () => {
	return (
		<div className="scrollTools">
			<IconButton onClick={scrollToTop}>
				<KeyboardArrowUp/>
			</IconButton>
			<IconButton onClick={scrollBottom}>
				<KeyboardArrowDown/>
			</IconButton>
		</div>
	)
}

export default ScrollTools
