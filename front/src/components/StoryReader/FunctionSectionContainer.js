import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {Redirect} from 'react-router-dom';

//
import ComposeQuery from '../../lib/hoc';
import {WithUserSelfQuery} from '../../graphql/user';
import {WithLikeStoryMutation, WithArchiveStoryMutation, WithDeleteStoryMutation} from '../../graphql/story';

import FunctionSection from './FunctionSection';
//import {openLoginDialog} from '../redux/actions';

class FunctionSectionContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deleteRedirect: false,
			archived: this.props.MeData.me && (
				this.props.MeData.me.archiveStory.indexOf(this.props.match.params._id) >= 0
			),
			liked: this.props.MeData.me && (
				this.props.MeData.me.likeStory.indexOf(this.props.match.params._id) >= 0
			),
			isAuthor: this.props.MeData.me && (
				props.MeData.me._id === props.storyDetailData.story.author._id
			)
		}
		// console.log(this.state.isAuthor); console.log(this.state.liked);
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
		//console.log(this.props);

		if (this.state.deleteRedirect) {
			return <Redirect push={true} to="/"/>;
		}

		return (
			<FunctionSection
				state={this.state}
				draft={this.props.storyDetailData.story.draft}
				story={this.props.storyDetailData.story}
				handleDelete={this.handleDelete}
				handleLike={this.handleLike}
				handleArchive={this.handleArchive}/>
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
	WithUserSelfQuery,
	WithLikeStoryMutation,
	WithArchiveStoryMutation,
	WithDeleteStoryMutation,
)(FunctionSectionContainerWithComposeQuery)

// handleOpenLoginDialog: PropTypes.func.isRequired,
//
// const mapDispatchToProps = ({handleOpenLoginDialog: openLoginDialog}) export
// default connect(null, mapDispatchToProps)(temp)