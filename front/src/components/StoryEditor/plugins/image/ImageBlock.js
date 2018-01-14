import React, {Component} from 'react'
import LazyLoad from 'react-lazyload'
import Clear from 'material-ui-icons/Clear'
import CommonBlock from '../../CommonBlock'
import BlockContent from '../../BlockContent'
import ImagePlaceHolder from '../../ImagePlaceHolder'

export default class ImageBlock extends Component {
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
		const {src, width, height} = this.props.blockProps
		return (
			<CommonBlock {...this.props} actions={this.actions}>
				<BlockContent>
					<LazyLoad
						throttle={2000}
						height={height}
						placeholder={<ImagePlaceHolder width = {
							width
						}
						height = {
							height
						} />}>
						<img alt="" src={src}/>
					</LazyLoad>
				</BlockContent>
			</CommonBlock>
		)
	}
}
