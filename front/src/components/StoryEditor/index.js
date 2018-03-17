import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';
import {compose} from 'recompose';
import format from 'date-fns/format';

//
import ErrorComp from '../../lib/ErrorComp';
import {error, onError} from '../../lib/utils';
import {ComposeQuery} from '../../lib/hoc';
import {WithDraftDetailsQuery, WithPublishDraftMutation} from '../../graphql/draft';

import Editor from './Editor';
import StoryHeadlineContainer from './StoryHeadlineContainer';

class StoryEditorContainer extends React.Component {
	state = {
		publishRedirect: false,
		linkedStoryID: undefined,
		error: error
	}

	handlePublish = async () => {
		var draftID = this.props.match.params._id
		this.props.publishDraft(draftID).then((data) => {
			this.setState(
				{publishRedirect: true, linkedStoryID: data.data.publishDraft.story}
			)
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {

		if (this.state.publishRedirect) {
			return <Redirect push={true} to={`/story/${this.state.linkedStoryID}`}/>;
		}

		return (

			<div className="topContainter">
				<ErrorComp error={this.state.error}/>
				<StoryHeadlineContainer
					draft={this.props.draftData.draft}
					match={this.props.match}/>
				<div className="storyContainer">
					<div>
						{
	format(new Date(this.props.draftData.draft.lastUpdate), "YYYY-MM-DD HH:mm:ss")
}
					</div>

					<div>
						<Editor
							startingContent={this.props.draftData.draft.content}
							startingImages={this.props.draftData.draft.images}
							match={this.props.match}/>
					</div>
					<div className="publishButton">
						<Button color="primary" onClick={this.handlePublish}>
							Publish Story
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

StoryEditorContainer.propTypes = {
	publishDraft: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	draftData: PropTypes.object.isRequired
}

const StoryEditorContainerWithComposeQuery = ComposeQuery(
	StoryEditorContainer,
	'draftData'
)

export default compose(WithDraftDetailsQuery, WithPublishDraftMutation)(
	StoryEditorContainerWithComposeQuery
)
