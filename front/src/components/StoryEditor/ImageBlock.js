import React, {Component} from 'react';
import LazyLoad from 'react-lazyload'

import ImagePlaceHolder from './ImagePlaceHolder'

export default class extends Component {
	render() {
		const {src, width, height} = this.props.blockProps
		if (src) {
			return (
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
			)
		} else {
			return (<ImagePlaceHolder width={width} height={height}/>)
		}
	}
}

// const ImageBlock = styled.img`   maxWidth: 100%;   height: auto `