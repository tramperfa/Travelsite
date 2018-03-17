import React from 'react'
import PropTypes from 'prop-types'

import StoryCard from './StoryCard'

const StoryList = ({stories}) => {
	return (
		<div style={{
				display: 'flex',
				flexDirection: 'column'
			}}>
			{
				stories.map(story => {
					// console.log(story);
					return (
						<div className="storyList" key={story._id}>
							<StoryCard story={story}/>
						</div>
					)
				})
			}
		</div>
	)
}

StoryList.propTypes = {
	stories: PropTypes.array.isRequired
}

export default StoryList
