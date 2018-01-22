import React from 'react';
import PropTypes from 'prop-types';
//
import {Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
//import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

//
import imageTest from '../../images/d.jpg';

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

const UserStoryCard = ({classes, story}) => {

	return (
		<div>
			<Card className={classes.card}>
				<Link className={classes.textField} to={`/story/${story._id}`} target="_blank">
					<CardMedia
						className={classes.cover}
						image={imageTest}
						title="Live from space album cover"/>
				</Link>
				<div className={classes.details} href={`/story/${story._id}`} target="_blank">
					<Link className={classes.textField} to={`/story/${story._id}`} target="_blank">
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
						</CardContent>
					</Link>
				</div>
			</Card>
		</div>
	)
}

UserStoryCard.propTypes = {
	classes: PropTypes.object.isRequired,
	story: PropTypes.object.isRequired
};

export default withStyles(styles)(UserStoryCard);
