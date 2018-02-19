import React from 'react';
import PropTypes from 'prop-types';
//import {Link} from 'react-router-dom'
import {withStyles} from 'material-ui/styles';
import {compose} from 'recompose';

//
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';

//
import ComposeQuery from '../../lib/hoc';
import {ItemCount} from '../../lib/utils';
import {WithUserStoryQuery} from '../../graphql/story';

//
import UserStoryCard from './UserStoryCard';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

const UserStory = ({userStoryData, match, classes}) => {
	console.log(userStoryData);
	const stories = userStoryData.userStories
	return (
		<div>
			{
				stories.map(story => (
					<div className="storyList" key={story._id}>
						<UserStoryCard story={story}/>
					</div>
				))
			}
			<div>
				<ItemCount number={stories.length} singular={'Story'} plural={'Stories'}/>
			</div>
		</div>
	)
}

UserStory.propTypes = {
	match: PropTypes.object.isRequired,
	userStoryData: PropTypes.object.isRequired
}

const UserStoryWithComposeQuery = ComposeQuery(UserStory, 'userStoryData')

export default compose(WithUserStoryQuery, withStyles(styles))(
	UserStoryWithComposeQuery
)
