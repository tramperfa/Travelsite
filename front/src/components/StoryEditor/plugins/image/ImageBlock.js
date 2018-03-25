import React, {Component} from 'react'
import LazyLoad from 'react-lazyload'
import Book from 'material-ui-icons/Book'
import Clear from 'material-ui-icons/Clear'
import CommonBlock from '../../atomicblock/CommonBlock'
import BlockContent from '../../atomicblock/BlockContent'
import ImagePlaceHolder from '../imageplaceholder/ImagePlaceHolder'

export default class ImageBlock extends Component {
	constructor(props) {
		super(props)
		this.actions = [
			{
				"key": "setAsCoverPhoto",
				"icon": Book,
				"action": this.props.container.setAsCoverPhoto
			}, {
				"key": "delete",
				"icon": Clear,
				"action": this.props.container.remove
			}
		]
	}

	render() {
		const {src, width, height} = this.props.blockProps
		const style = {
			width: width,
			height: height
		}
		return (
			<CommonBlock actions={this.actions} style={style}>
				<BlockContent>
					<LazyLoad
						height={height}
						placeholder={<ImagePlaceHolder data = {
							style
						} />}>
						<img alt="" src={src}/>
					</LazyLoad>
				</BlockContent>
			</CommonBlock>
		)
	}
}
