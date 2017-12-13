import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';
import {Link} from 'react-router-dom'
import {withStyles} from 'material-ui/styles';
//

import {withMyStoryData} from './MyHome';
import MyStoryCard from '../../components/MyStoryCard';

const styles = theme => ({
	textField: {
		textDecoration: 'none'
	}
});

const StoryCount = (props) => {
	const number = props.number
	if (number === 0) {
		return (<div>
			A Story is Missing Here
		</div>)
	} else if (number === 1) {
		return (<div>
			Total 1 Story
		</div>)
	} else {
		return (<div>
			Total {number + '  '}
			Stories
		</div>)
	}
}

class MyStory extends React.Component {

	render() {

		if (this.props.myStoryData.loading) {
			return (<div>Loading</div>)
		}

		const stories = this.props.myStoryData.myStories

		return (
			<div>
				{
					stories.map(story => (
						<div className="storyList" key={story._id}>
							<MyStoryCard story={story}/>
						</div>
					))
				}
				<div>
					<Link
						className={this.props.classes.textField}
						to={`${this.props.match.url}/delete`}>
						<Button raised="raised" color="accent">
							My Deleted Stories
							<Delete/>
						</Button>
					</Link>
				</div>
				<div>
					<StoryCount number={stories.length}/>
				</div>
			</div>
		)
	}
}

MyStory.propTypes = {
	match: PropTypes.object.isRequired,
	myStoryData: PropTypes.object.isRequired
}

export default withMyStoryData(withStyles(styles)(MyStory))
