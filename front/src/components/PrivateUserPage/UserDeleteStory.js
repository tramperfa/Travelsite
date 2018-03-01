import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {compose} from 'recompose';

//
import {WithMyDeleteStoryQuery} from '../../graphql/story';
import ComposeQuery from '../../lib/hoc';
import {ItemCount} from '../../lib/utils';

//
import UserDeleteStoryCard from './UserDeleteStoryCard';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

class MyDeleteStory extends React.Component {
	render() {
		const stories = this.props.myDeleteStoryData.myDeletedStories
		return (
			<div>
				{
					stories.map(story => (
						<div className="storyList" key={story._id}>
							<UserDeleteStoryCard story={story}/>
						</div>
					))
				}
				<div>
					<ItemCount
						number={stories.length}
						singular={'Deleted Story'}
						plural={'Deleted Stories'}/>
				</div>
			</div>
		)
	}
}

MyDeleteStory.propTypes = {
	match: PropTypes.object.isRequired,
	myDeleteStoryData: PropTypes.object.isRequired
}

const MyDeleteStoryWithComposeQuery = ComposeQuery(
	MyDeleteStory,
	'myDeleteStoryData'
)

export default compose(withStyles(styles), WithMyDeleteStoryQuery)(
	MyDeleteStoryWithComposeQuery
)
