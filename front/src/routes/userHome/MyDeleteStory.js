import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import {withStyles} from 'material-ui/styles';

//
import {MY_DELETE_STORY_QUERY} from '../../graphql/story';

//
import DeleteStoryCard from '../../components/DeleteStoryCard';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

const StoryCount = (props) => {
	const number = props.number
	if (number === 0) {
		return (<div>
			No deleted story
		</div>)
	} else if (number === 1) {
		return (<div>
			Total 1 Deleted Story
		</div>)
	} else {
		return (<div>
			Total {number + '  '}
			Deleted Stories
		</div>)
	}
}

class MyStory extends React.Component {

	render() {

		if (this.props.myDeleteStoryData.loading) {
			return (<div>Loading</div>)
		}

		const stories = this.props.myDeleteStoryData.myDeletedStories

		return (
			<div>
				{
					stories.map(story => (
						<div className="storyList" key={story._id}>
							<DeleteStoryCard story={story}/>
						</div>
					))
				}
				<div>
					<StoryCount number={stories.length}/>
				</div>
			</div>
		)
	}
}

MyStory.propTypes = {
	match: PropTypes.object.isRequired,
	myDeleteStoryData: PropTypes.object.isRequired
}

export const withMyStoryData = graphql(MY_DELETE_STORY_QUERY, {
	options: {
		fetchPolicy: 'network-only'
	},
	name: 'myDeleteStoryData'
})

export default withMyStoryData(withStyles(styles)(MyStory))
