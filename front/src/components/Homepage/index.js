import React from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import {WithStoryListQuery} from '../../graphql/story';
import ComposeQuery from '../../lib/hoc';

import StoryCard from './StoryCard';

const HomePage = ({data}) => {
	console.log(data.stories);
	return (
		<div>
			<div></div>
			<div>
				{
					data.stories.map(story => {
						console.log(story);
						return (
							<div className="storyList" key={story._id}>
								<StoryCard story={story}/>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}

const HomePageWithQuery = ComposeQuery(HomePage)

export default WithStoryListQuery(HomePageWithQuery)