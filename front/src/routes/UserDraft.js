import React from 'react'
import {graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

//
import {DRAFTS_LIST_QUERY, CREATE_DRAFT_MUTATION} from '../graphql/draft';

//
import DraftList from '../components/DraftList';

export class UserDraft extends React.Component {
	state = {
		newDraftID: null
	}

	handleCreate = async () => {
		this.props.createDraft().then((data) => {
			//console.log(JSON.stringify(data));
			this.setState({newDraftID: data.data.createDraft._id})
		})
	}

	render() {
		if (this.state.newDraftID) {
			return <Redirect push={true} to={`/edit/${this.state.newDraftID}`}/>;
		}

		return (
			<div>
				<DraftList/>
				<Button
					raised="raised"
					color="primary"
					onClick={this.handleCreate}
					label='draftCreate'>
					CREATE NEW DRAFT
				</Button>
			</div>
		)
	}

}

UserDraft.propTypes = {
	createDraft: PropTypes.func.isRequired
}

export const WithCreateDraft = graphql(CREATE_DRAFT_MUTATION, {
	props: ({mutate}) => ({
		createDraft: () => mutate({
			refetchQueries: [
				{
					query: DRAFTS_LIST_QUERY
				}
			]
		})
	})
})

export default WithCreateDraft(UserDraft)