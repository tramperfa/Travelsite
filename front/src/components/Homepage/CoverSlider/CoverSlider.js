import React, {Component} from 'react'

import "react-responsive-carousel/lib/styles/carousel.min.css"
import {Carousel} from "react-responsive-carousel"

import CoverStory from './CoverStory'

class CoverSlider extends Component {

	render() {
		const {coverStories} = this.props
		return (
			<div>
				<Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
					{
						coverStories.filter(
							story => story.headlineImage !== undefined && story.headlineImage !== null
						).map(story => (<CoverStory story={story}/>))
					}
				</Carousel>
			</div>
		)
	}
}

export default CoverSlider
