import React, {Component} from 'react'
import LazyLoad from 'react-lazyload'
import Comment from 'material-ui-icons/Comment'
import CommonBlock from '../../StoryEditor/atomicblock/CommonBlock'
import BlockContent from '../../StoryEditor/atomicblock/BlockContent'
import ImagePlaceHolder from '../../StoryEditor/plugins/imageplaceholder/ImagePlaceHolder'

export default class ImageBlock extends Component {
	constructor(props) {
		super(props)
		this.actions = [
			{
				"key": "comment",
				"icon": Comment,
				"action": this.comment
			}
		]
	}

	comment = () => {
		console.log("Comment");
	}

	render() {
		const {src, width, height} = this.props
		const style = {
			width: width,
			height: height
		}
		return (
			<div className="atomicReader">
				<CommonBlock actions={this.actions} style={style}>
					<BlockContent>
						<LazyLoad
							throttle={2000}
							height={height}
							placeholder={<ImagePlaceHolder data = {
								style
							} />}>
							<img alt="" src={src}/>
						</LazyLoad>
					</BlockContent>
				</CommonBlock>
			</div>
		)
	}
}
