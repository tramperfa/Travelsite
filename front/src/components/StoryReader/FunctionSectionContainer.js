import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {Redirect} from 'react-router-dom';
//

import ErrorComp from '../../lib/ErrorComp';
import {error, onError} from '../../lib/utils';
import ComposeQuery from '../../lib/hoc';
//import {WithUserSelfStoryReaderQuery} from '../../graphql/user';
import {WithLikeStoryMutation, WithArchiveStoryMutation, WithDeleteStoryMutation} from '../../graphql/story';

import FunctionSection from './FunctionSection';
//import {openLoginDialog} from '../redux/actions';

class FunctionSectionContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deleteRedirect: false,
			archived: this.props.MeData.userSelf && (
				this.props.MeData.userSelf.archiveStory.indexOf(this.props.match.params._id) >= 0
			),
			liked: this.props.MeData.userSelf && (
				this.props.MeData.userSelf.likeStory.indexOf(this.props.match.params._id) >= 0
			),
			isAuthor: this.props.MeData.userSelf && (
				props.MeData.userSelf._id === this.props.storyDetailData.story.author._id
			),
			error: error
		}
		// console.log(this.state.isAuthor); console.log(this.state.liked);
		this.onError = onError.bind(this)
	}

	handleLike = () => {
		var storyID = this.props.match.params._id
		this.props.likeStory(storyID).then(() => {
			this.setState({liked: true})
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	handleArchive = () => {
		var storyID = this.props.match.params._id
		this.props.archiveStory(storyID).then(() => {
			this.setState({archived: true})
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	handleDelete = () => {
		var storyID = this.props.match.params._id
		this.props.deleteStory(storyID).then(() => {
			this.setState({deleteRedirect: true})
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {
		// console.log(this.props.MeData.userSelf);
		// console.log(this.props.storyDetailData.story.author._id);

		if (this.state.deleteRedirect) {
			return <Redirect push={true} to="/"/>;
		}

		return (
			<div>
				<ErrorComp error={this.state.error}/>
				<FunctionSection
					state={this.state}
					draft={this.props.storyDetailData.story.draft}
					story={this.props.storyDetailData.story}
					handleDelete={this.handleDelete}
					handleLike={this.handleLike}
					handleArchive={this.handleArchive}/>
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

export default compose(
	WithLikeStoryMutation,
	WithArchiveStoryMutation,
	WithDeleteStoryMutation,
)(FunctionSectionContainer)
