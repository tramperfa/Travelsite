import React, {Component} from 'react'

import "react-responsive-carousel/lib/styles/carousel.min.css"
import {Carousel} from "react-responsive-carousel"

import CoverStory from './CoverStory'

class CoverSlider extends Component {

	render() {
		const {coverStories} = this.props
		return (
			<div className="coverSlider">
				<Carousel showThumbs={false} autoPlay={false} infiniteLoop={true}>
					{
						coverStories.filter(
							story => story.headlineImage !== undefined && story.headlineImage !== null
						).map(story => (<CoverStory key={story._id} story={story}/>))
					}
				</Carousel>
			</div>
		)
	}
}

export default CoverSlider
