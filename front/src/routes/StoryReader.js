import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import IconButton from 'material-ui/IconButton';
import FavoriteBorder from "material-ui-icons/FavoriteBorder";
import StarBorder from "material-ui-icons/StarBorder";
import Favorite from "material-ui-icons/Favorite";
import Star from "material-ui-icons/Star";
import Comment from "material-ui-icons/Comment";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
// import Reply from "material-ui-icons/Reply"; import {createBrowserHistory}
// from 'history'; const history = createBrowserHistory()

import {STORY_DETAILS_QUERY, LIKE_STORY_MUTATION, ARCHIVE_STORY_MUTATION, DELETE_STORY_MUTATION} from '../graphql/story';
import {ME_QUERY} from '../graphql/user';

class Story extends React.Component {
	state = {
		deleteRedirect: false,
		owner: false,
		errorMessage: null,
		liked: false,
		archived: false
	}

	componentDidUpdate(prevProps) {

		if (this.props.MeData.me && (prevProps.MeData.me !== this.props.MeData.me)) {

			if (this.props.MeData.me.likeStory.indexOf(this.props.match.params._id) >= 0) {
				this.setState({liked: true})
			}
			if (this.props.MeData.me.archiveStory.indexOf(this.props.match.params._id) >= 0) {
				this.setState({archived: true})
			}
		}

		if (((prevProps.MeData.me !== this.props.MeData.me) || (prevProps.storyData.story !== this.props.storyData.story)) && this.props.MeData.me && this.props.storyData.story && this.props.MeData.me._id === this.props.storyData.story.author._id) {
			//console.log("SET OWNER");
			this.setState({owner: true})
		}

	}

	handleLike = () => {
		var storyID = this.props.match.params._id
		this.props.likeStory(storyID).then(() => {
			this.setState({liked: true})
		}).catch((e) => {
			if (e.graphQLErrors[0].message === "User Not Logged In") {
				//console.log("TRIGGER LOGIN");
				this.props.handleTriggerOpen()
			}
			this.setState({errorMessage: e.graphQLErrors[0].message})
		})
	}

	handleArchive = () => {
		var storyID = this.props.match.params._id
		this.props.archiveStory(storyID).then(() => {
			this.setState({archived: true})
		}).catch((e) => {
			if (e.graphQLErrors[0].message === "User Not Logged In") {
				//console.log("TRIGGER LOGIN");
				this.props.handleTriggerOpen()
			}
			this.setState({errorMessage: e.graphQLErrors[0].message})
		})
	}

	handleDelete = () => {
		var storyID = this.props.match.params._id
		this.props.deleteStory(storyID).then(() => {
			this.setState({deleteRedirect: true})
		}).catch((e) => {
			this.setState({errorMessage: e.graphQLErrors[0].message})
		})
	}

	render() {

		const story = this.props.storyData.story;

		if (this.props.storyData.loading || this.props.MeData.loading) {
			return (<div>Loading</div>)
		}

		if (this.state.deleteRedirect) {
			return <Redirect push={true} to="/"/>;
		}

		return (

			<div>
				<div>
					<div>{"Tiltle: " + story.title}</div>
					<div>{"Author: " + story.author.fullName}</div>
					{/* <div>{"Author: " + story.draft}</div> */}
					<div>{story.likeStoryCount + "Likes"}</div>
					<div>{story.viewCount + "Views"}</div>
					<div>{story.archiveStoryCount + "Archives"}</div>
					<div style={{
							color: 'red'
						}}>
						{this.state.errorMessage}
					</div>
					<div>
						{moment(new Date(story.lastUpdate)).utc().local().format("YYYY-MM-DD HH:mm")}
					</div>

				</div>
				<IconButton aria-label="Like" onClick={this.handleLike}>
					{
						this.state.liked
							? <Favorite/>
							: <FavoriteBorder/>
					}

				</IconButton>
				<IconButton aria-label="Archive" onClick={this.handleArchive}>
					{
						this.state.archived
							? <Star/>
							: <StarBorder/>
					}
				</IconButton>
				<IconButton aria-label="Comment">
					<Comment/>
				</IconButton>
				<div>
					{
						this.state.owner && <Link to={`/edit/${story.draft}`}>
								<IconButton aria-label="Edit">
									<Edit/>
								</IconButton>
							</Link>
					}
					{
						this.state.owner && <IconButton aria-label="Delete" onClick={this.handleDelete}>
								<Delete/>
							</IconButton>
					}
				</div>
			</div>
		)
	}
}

Story.propTypes = {
	likeStory: PropTypes.func.isRequired,
	archiveStory: PropTypes.func.isRequired,
	deleteStory: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	storyData: PropTypes.object.isRequired,
	handleTriggerOpen: PropTypes.func.isRequired,
	MeData: PropTypes.object.isRequired
}

export const WithData = graphql(STORY_DETAILS_QUERY, {
	options: (props) => ({
		variables: {
			_id: props.match.params._id
		},
		//notifyOnNetworkStatusChange: true
	}),
	name: 'storyData'
})

export const WithMeData = graphql(ME_QUERY, {
	options: {
		//notifyOnNetworkStatusChange: true
	},
	name: 'MeData'
})

export const WithLike = graphql(LIKE_STORY_MUTATION, {
	props: ({mutate}) => ({
		likeStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			}
		})
	})
})

export const WithArchive = graphql(ARCHIVE_STORY_MUTATION, {
	props: ({mutate}) => ({
		archiveStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			}
		})
	})
})

//NO REFETCH NEEDED
export const WithDelete = graphql(DELETE_STORY_MUTATION, {
	props: ({mutate}) => ({
		deleteStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			}
		})
	})
})

export default WithDelete(WithArchive(WithLike(WithData(WithMeData(Story)))))