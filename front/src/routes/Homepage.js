import React from 'react'
import StoryCard from '../components/StoryCard';
//import Highlight from './Highlight';

import {WithStoryListQuery} from '../graphql/story';
import ComposeQuery from '../lib/hoc';

const HomePage = ({data}) => {
	return (
		<div>
			{/* <div><Highlight/></div> */}
			{
				data.stories.map(story => (
					<div className="storyList" key={story._id}>
						<StoryCard story={story}/>
					</div>
				))
			}
		</div>
	)
}

const HomePageWithQuery = ComposeQuery(HomePage)

export default WithStoryListQuery(HomePageWithQuery)