import React, {Component} from 'react'
import Clear from 'material-ui-icons/Clear'
import CommonBlock from '../../atomicblock/CommonBlock'
import BlockContent from '../../atomicblock/BlockContent'

export default class VideoBlock extends Component {
	constructor(props) {
		super(props)
		this.actions = [
			{
				"key": "delete",
				"icon": Clear,
				"action": this.props.container.remove
			}
		]
	}

	render() {
		const {width, height} = this.props.blockProps
		const style = {
			width: width,
			height: height
		}
		return (
			<CommonBlock actions={this.actions} style={style}>
				<BlockContent>
					<iframe
						title={this.props.blockKey}
						width={width}
						height={height}
						frameBorder="0"
						allowFullScreen="true"
						src={this.props.data.src}/>
				</BlockContent>
			</CommonBlock>
		)
	}
}
