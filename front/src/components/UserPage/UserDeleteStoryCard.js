import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
//
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Undo from "material-ui-icons/Undo";

import {WithRecoverStoryMutation} from '../../graphql/story';

import imageTest from '../../images/g.jpeg';

const styles = theme => ({
	card: {
		display: 'flex',
		marginTop: 24,
		width: 640,
		height: 300
	},
	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	cover: {
		width: 440,
		height: 300
	},
	textField: {
		textDecoration: 'none'
	}
});

const UserDeleteStoryCard = ({classes, story, recoverStory}) => {

	const handleRecover = () => {
		recoverStory(story._id)
		console.log("TBD Recover");
	}

	return (
		<div>
			<Card className={classes.card}>
				<CardMedia className={classes.cover} image={imageTest}/>
				<div className={classes.details}>
					<CardContent className={classes.content}>
						<Typography type="headline">
							{story.title}
						</Typography>
						<div>{story.viewCount}
							Views
						</div>
						<div>
							{story.likeStoryCount}
							Likes
						</div>
						<IconButton aria-label="Undo" onClick={handleRecover}>
							Recovery Story
							<Undo/>
						</IconButton>
					</CardContent>
				</div>
			</Card>
		</div>
	)
}

UserDeleteStoryCard.propTypes = {
	classes: PropTypes.object.isRequired,
	recoverStory: PropTypes.func.isRequired,
	story: PropTypes.object.isRequired
}

export default compose(WithRecoverStoryMutation, withStyles(styles))(
	UserDeleteStoryCard
)
