import React from 'react'
import {WithStoryListQuery} from '../../graphql/story';
import ComposeQuery from '../../lib/hoc';

import CoverSlider from './CoverSlider/CoverSlider'
import StoryList from './StoryList'

const HomePage = ({data}) => {
	// console.log(data.stories);
	return (
		<div>
			<div>
				<CoverSlider coverStories={data.stories}/>
			</div>
			<div className="centerContainer">
				<StoryList stories={data.stories}/>
			</div>
		</div>
	)
}

const HomePageWithQuery = ComposeQuery(HomePage)

export default WithStoryListQuery(HomePageWithQuery)