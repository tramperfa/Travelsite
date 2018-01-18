import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';

//
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from "material-ui-icons/FavoriteBorder";
import StarBorder from "material-ui-icons/StarBorder";
import Favorite from "material-ui-icons/Favorite";
import Star from "material-ui-icons/Star";
import Comment from "material-ui-icons/Comment";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";

// import Reply from "material-ui-icons/Reply"; import {createBrowserHistory}

//
import ComposeQuery from '../lib/hoc';
import {WithMeQuery} from '../graphql/user'
import {WithLikeStoryMutation, WithArchiveStoryMutation, WithDeleteStoryMutation} from '../graphql/story'

//import {openLoginDialog} from '../redux/actions';

class FunctionSectionContainer extends React.Component {

	state = {
		deleteRedirect: false
	}

	handleLike = () => {
		var storyID = this.props.match.params._id
		this.props.likeStory(storyID).then(() => {
			this.setState({liked: true})
		})
	}

	handleArchive = () => {
		var storyID = this.props.match.params._id
		this.props.archiveStory(storyID).then(() => {
			this.setState({archived: true})
		})
	}

	handleDelete = () => {
		var storyID = this.props.match.params._id
		this.props.deleteStory(storyID).then(() => {
			this.setState({deleteRedirect: true})
		})
	}

	render() {

		if (this.state.deleteRedirect) {
			return <Redirect push={true} to="/"/>;
		}

		return (
			<div>
				<IconButton aria-label="Like" onClick={this.handleLike}>
					{

						(
							this.props.MeData.me && this.props.MeData.me.likeStory.indexOf(this.props.match.params._id) >= 0
						)
							? <Favorite/>
							: <FavoriteBorder/>
					}

				</IconButton>
				<IconButton aria-label="Archive" onClick={this.handleArchive}>
					{
						(
							this.props.MeData.me && this.props.MeData.me.archiveStory.indexOf(this.props.match.params._id) >= 0
						)
							? <Star/>
							: <StarBorder/>
					}
				</IconButton>
				<IconButton aria-label="Comment">
					<Comment/>
				</IconButton>
				{
					(
						this.props.MeData.me && (this.props.MeData.me._id === this.props.storyDetailData.story.author._id)
					) && (
						<span>
							<Link to={`/edit/${this.props.storyDetailData.story.draft}`}>
								<IconButton aria-label="Edit">
									<Edit/>
								</IconButton>
							</Link>
							<IconButton aria-label="Delete" onClick={this.handleDelete}>
								<Delete/>
							</IconButton>
						</span>

					)

				}
			</div>
		)
	}
}

FunctionSectionContainer.propTypes = {
	MeData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	likeStory: PropTypes.func.isRequired,
	archiveStory: PropTypes.func.isRequired,
	storyDetailData: PropTypes.object,
	deleteStory: PropTypes.func.isRequired
}

const FunctionSectionContainerWithComposeQuery = ComposeQuery(
	FunctionSectionContainer,
	'MeData'
)

export default compose(
	WithMeQuery,
	WithLikeStoryMutation,
	WithArchiveStoryMutation,
	WithDeleteStoryMutation,
)(FunctionSectionContainerWithComposeQuery)

// handleOpenLoginDialog: PropTypes.func.isRequired,
//
// const mapDispatchToProps = ({handleOpenLoginDialog: openLoginDialog}) export
// default connect(null, mapDispatchToProps)(temp)