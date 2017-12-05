import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import {Redirect} from 'react-router-dom';

import {DraftDetailsQuery} from '../graphql/draft';
import {PublishDraftMutation} from '../graphql/draft';

import Editor from '../components/StoryEditor/Editor';
import StoryTitle from '../components/StoryTitle';
import StoryHeadline from '../components/StoryHeadline';

class Draft extends React.Component {
	state = {
		publishRedirect: false,
		linkedStoryID: undefined,
		errorMessage: null
	}

	handlePublish = async () => {
		try {
			var draftID = this.props.match.params._id
			var data = await this.props.publishDraft(draftID)
			this.setState(
				{publishRedirect: true, linkedStoryID: data.data.publishDraft.story}
			)
		} catch (e) {
			this.setState({errorMessage: e.graphQLErrors[0].message})
		} finally {}
	}

	render() {
		//console.log(this.props.draftData.draft);
		if (this.state.publishRedirect) {
			return <Redirect push={true} to={`/story/${this.state.linkedStoryID}`}/>;
		}

		if (this.props.draftData.loading) {
			return (<div>Loading</div>)
		}

		//console.log(this.props.draftData.draft);

		return (

			<div>
				<StoryHeadline draft={this.props.draftData.draft} match={this.props.match}/>
				<StoryTitle title={this.props.draftData.draft.title} match={this.props.match}/>
				<div>
					{
						moment(new Date(this.props.draftData.draft.lastUpdate)).utc().local().format(
							"YYYY-MM-DD HH:mm"
						)
					}
				</div>

				<div>
					<Editor
						startingContent={this.props.draftData.draft.content}
						startingImages={this.props.draftData.draft.images}
						match={this.props.match}/>
				</div>
				<Button color="primary" onClick={this.handlePublish}>
					Publish Travel Draft
				</Button>
			</div>
		)
	}
}

Draft.propTypes = {
	publishDraft: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	draftData: PropTypes.object.isRequired
}

export const WithDraftData = graphql(DraftDetailsQuery, {
	options: (props) => ({
		variables: {
			draftID: props.match.params._id
		},
		fetchPolicy: 'network-only'
	}),
	name: 'draftData'

})

export const WithPublish = graphql(PublishDraftMutation, {
	props: ({mutate}) => ({
		publishDraft: (draftID) => mutate({
			variables: {
				draftID: draftID
			}
		})
	})
})

export default WithPublish(WithDraftData(Draft))