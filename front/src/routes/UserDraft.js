import React from 'react'
import {graphql} from 'react-apollo';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

//
import {draftsListQuery, createDraftMutation} from '../graphql/draft';

//
import DraftList from '../components/DraftList';

export class TheUserDraft extends React.Component {
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

TheUserDraft.propTypes = {
	createDraft: PropTypes.func.isRequired
}

export const WithCreateDraft = graphql(createDraftMutation, {
	props: ({mutate}) => ({
		createDraft: () => mutate({
			refetchQueries: [
				{
					query: draftsListQuery
				}
			]
		})
	})
})

export default WithCreateDraft(TheUserDraft)