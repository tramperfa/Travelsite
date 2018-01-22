import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import {withStyles} from 'material-ui/styles';
import {compose} from 'recompose';

//
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';

//
import ComposeQuery from '../../lib/hoc';
import {ItemCount} from '../../lib/utils';
import {WithMyStoryQuery} from '../../graphql/story';

//
import UserStoryCard from './UserStoryCard';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

const UserStory = ({myStoryData, classes, match}) => {
	const stories = myStoryData.myStories
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
				<Link className={classes.textField} to={`${match.url}/delete`}>
					<Button raised={true} color="accent">
						My Deleted Stories
						<Delete/>
					</Button>
				</Link>
			</div>
			<div>
				<ItemCount number={stories.length} singular={'Story'} plural={'Stories'}/>
			</div>
		</div>
	)
}

UserStory.propTypes = {
	match: PropTypes.object.isRequired,
	myStoryData: PropTypes.object.isRequired
}

const UserStoryWithComposeQuery = ComposeQuery(UserStory, 'myStoryData')

export default compose(WithMyStoryQuery, withStyles(styles))(
	UserStoryWithComposeQuery
)
