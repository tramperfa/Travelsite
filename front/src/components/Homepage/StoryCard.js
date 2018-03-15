import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {withStyles} from 'material-ui/styles';
import Card, {CardContent, CardMedia} from 'material-ui/Card';
import {MuiThemeProvider, createMuiTheme} from "material-ui/styles";
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Share from "material-ui-icons/Share";
import Comment from "material-ui-icons/Comment";
//import Avatar from 'material-ui/Avatar';
import CONSTS from '../../lib/consts';

import defaultbrowserCoverImage from '../../images/browserCoverImage.png';
import StoryListAuthor from './StoryListAuthor'
//import   defaultAvatar.jpg

const theme = createMuiTheme({
	overrides: {
		MuiCardContent: {
			root: {
				// '&:last-child': { 	position: 'absolute', 	top: 0, 	left: 0, 	paddingBottom:
				// 12 },
				paddingTop: 0
			}
		},
		MuiPaper: {
			shadow2: {
				boxShadow: 0
			}
		}
	}
})

const styles = theme => ({
	card: {
		display: 'flex',
		marginTop: 24,
		width: 700,
		height: 150
	},
	details: {
		position: 'relative'
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
	},
	headline: {
		width: 448,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		fontSize: 18
	},
	controls: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	}
});

const StoryCard = ({classes, story}) => {
	//console.log(story.title); console.log(story.coverImage.browserCoverImage);
	return (
		<div>
			<MuiThemeProvider theme={theme}>
				<Card className={classes.card}>
					<Link className={classes.textField} to={`story/${story._id}`} target="_blank">
						<CardMedia
							className={classes.cover}
							image={story.coverImage
								? CONSTS.BUCKET_NAME + story.coverImage.browserCoverImage.filename
								: defaultbrowserCoverImage}/>

					</Link>
					<div className={classes.details}>

						<CardContent className={classes.content}>
							<Link className={classes.textField} to={`story/${story._id}`} target="_blank">
								<Typography className={classes.headline} type="headline">
									{story.title}
								</Typography>
							</Link>
							{/* <Typography type="subheading" color="secondary"> */}
							{/* <Avatar
									alt="Remy Sharp"
									src="/static/images/remy.jpg"
									className={classes.avatar}/> */
							}

							{/* </Typography> */}

						</CardContent>

						<div className={classes.controls}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									paddingLeft: 16
								}}>
								<StoryListAuthor author={story.author}/>
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
								<div style={{
										whiteSpace: 'nowrap'
									}}>
									{story.archiveStoryCount + ' Archives  ' + story.likeStoryCount + ' Likes'}
								</div>
							</div>
						</div>
					</div>
				</Card>
			</MuiThemeProvider>
		</div>
	)
}
StoryCard.propTypes = {
	classes: PropTypes.object.isRequired,
	story: PropTypes.object.isRequired
};

export default withStyles(styles)(StoryCard);
