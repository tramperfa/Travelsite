import React, {Component} from 'react';
import LazyLoad from 'react-lazyload'
import IconButton from 'material-ui/IconButton'
import Clear from 'material-ui-icons/Clear'
import ImagePlaceHolder from './ImagePlaceHolder'

const ICONWIDTH = 48

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
		const block = this.props.block
		const {src, width, height} = this.props.blockProps
		const centerX = width - ICONWIDTH
		const centerY = 0
		if (src) {
			return (
				<div
					style={{
						width: width,
						height: height
					}}
					onMouseEnter={this.onMouseEnter}
					onMouseLeave={this.onMouseLeave}>
					{
						this.state.onHover && <IconButton
								onClick={() => this.onDelete(block.getKey())}
								style={{
									position: "relative",
									top: 0,
									left: centerX,
									backgroundColor: "#FFFFFF",
									opacity: 0.75,
									zIndex: 10
								}}>
								<Clear/>
							</IconButton>
					}
					<div
						style={{
							position: "relative",
							top: this.state.onHover
								? -ICONWIDTH
								: 0,
							left: 0
						}}>
						<LazyLoad
							throttle={2000}
							height={height}
							placeholder={<ImagePlaceHolder width = {
								width
							}
							height = {
								height
							} />}>
							<img className="image" alt="" src={src}/>
						</LazyLoad>
					</div>
				</div>
			)
		} else {
			return (<ImagePlaceHolder width={width} height={height}/>)
		}
	}
}
