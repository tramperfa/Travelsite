import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Share from "material-ui-icons/Share";
import Comment from "material-ui-icons/Comment";
//import Avatar from 'material-ui/Avatar';
import CONSTS from '../../lib/consts';

import defaultbrowserCoverImage from '../../images/browserCoverImage.png';
//import   defaultAvatar.jpg

const styles = theme => ({
	card: {
		display: 'flex',
		marginTop: 24,
		width: 520,
		height: 150
	},
	details: {
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	cover: {
		width: 220,
		height: 150
	},
	textField: {
		textDecoration: 'none'
	}
});

const StoryCard = ({classes, story}) => {

	//console.log(story.title); console.log(story.coverImage.browserCoverImage);
	return (
		<div>
			<Card className={classes.card}>
				<Link className={classes.textField} to={`story/${story._id}`} target="_blank">
					<CardMedia
						className={classes.cover}
						image={story.coverImage
							? CONSTS.BUCKET_NAME + story.coverImage.browserCoverImage.filename
							: defaultbrowserCoverImage}/>

				</Link>
				<div className={classes.details}>
					<Link className={classes.textField} to={`story/${story._id}`} target="_blank">
						<CardContent className={classes.content}>
							<Typography type="headline">
								{story.title}
							</Typography>
							<Typography type="subheading" color="secondary">
								{/* <Avatar
									alt="Remy Sharp"
									src="/static/images/remy.jpg"
									className={classes.avatar}/> */
								}
								{story.author.fullName}
							</Typography>
							<div>
								{story.archiveStoryCount}
								Archives {story.likeStoryCount}
								Likes
							</div>
						</CardContent>
					</Link>
					<div className={classes.controls}>
						<IconButton aria-label="Share">
							<Share/>
						</IconButton>
						{/* <IconButton aria-label="Reply">
              <Reply/>
            </IconButton> */
						}
						<IconButton aria-label="Comment">
							<Comment/>
						</IconButton>
					</div>
				</div>
			</Card>
		</div>
	)
}
StoryCard.propTypes = {
	classes: PropTypes.object.isRequired,
	story: PropTypes.object.isRequired
};

export default withStyles(styles)(StoryCard);
