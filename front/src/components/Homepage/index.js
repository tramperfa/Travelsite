import React from 'react'
import {WithStoryListQuery} from '../../graphql/story';
import ComposeQuery from '../../lib/hoc';

import CoverSlider from './CoverSlider/CoverSlider'
import StoryCard from './StoryCard';

const HomePage = ({data}) => {
	console.log(data.stories);
	return (
		<div>
			<div>
				<CoverSlider coverStories={data.stories}/>
			</div>
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