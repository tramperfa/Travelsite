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
import ErrorComp from '../../lib/ErrorComp';
import {error, onError} from '../../lib/utils';
import CONSTS from '../../lib/consts';
import defaultBrowserUserHomeCoverImage from '../../images/browserUserHomeCoverImage.png';

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

//const UserDeleteStoryCard = ({classes, story, recoverStory}) => {

class UserDeleteStoryCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: error
		}
	}

	handleRecover = () => {
		this.props.recoverStory(this.props.story._id).then(() => {
			///////
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {
		return (
			<div>
				<ErrorComp error={this.state.error}/>
				<Card className={this.props.classes.card}>
					<CardMedia
						className={this.props.classes.cover}
						image={this.props.story.coverImage
							? CONSTS.BUCKET_NAME + this.props.story.coverImage.browserUserHomeCoverImage.filename
							: defaultBrowserUserHomeCoverImage}/>
					<div className={this.props.classes.details}>
						<CardContent className={this.props.classes.content}>
							<Typography type="headline">
								{this.props.story.title}
							</Typography>
							<div>{this.props.story.viewCount}
								Views
							</div>
							<div>
								{this.props.story.likeStoryCount}
								Likes
							</div>
							<IconButton aria-label="Undo" onClick={this.handleRecover}>
								Recovery Story
								<Undo/>
							</IconButton>
						</CardContent>
					</div>
				</Card>
			</div>
		)

	}
}

UserDeleteStoryCard.propTypes = {
	classes: PropTypes.object.isRequired,
	recoverStory: PropTypes.func.isRequired,
	story: PropTypes.object.isRequired
}

export default compose(WithRecoverStoryMutation, withStyles(styles))(
	UserDeleteStoryCard
)
