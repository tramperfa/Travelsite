import React, {Component} from 'react';

import IconButton from 'material-ui/IconButton'
import Clear from 'material-ui-icons/Clear'

import CONFIG from '../../lib/config'
const DRAFT_WIDTH = CONFIG.DRAFT_WIDTH
const ICONWIDTH = 48
const videoHeight = DRAFT_WIDTH * 9 / 16
const centerX = DRAFT_WIDTH - ICONWIDTH

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
	onDelete = (blockKey) => {
		this.props.blockProps.deleteBlock(blockKey)
	}

	render() {
		const contentState = this.props.contentState
		const block = this.props.block
		const entityKey = block.getEntityAt(0)
		const {src} = contentState.getEntity(entityKey).getData()

		return (
			<div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				<IconButton
					onClick={() => this.onDelete(block.getKey())}
					style={{
						position: "relative",
						top: 0,
						left: centerX,
						backgroundColor: "#FFFFFF",
						opacity: 0.75,
						zIndex: 10,
						display: this.state.onHover
							? "block"
							: "none"
					}}>
					<Clear/>
				</IconButton>
				<div
					style={{
						position: "relative",
						top: this.state.onHover
							? -ICONWIDTH
							: 0,
						width: DRAFT_WIDTH,
						height: videoHeight,
						backGround: "#000000"
					}}>
					<iframe
						width="100%"
						height="100%"
						frameBorder="0"
						allowFullScreen="true"
						src={src}/>
				</div>
			</div>
		)
	}
}
