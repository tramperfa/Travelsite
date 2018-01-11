import React from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {compose} from 'recompose';

//
import {renderWhileLoading, graphQLQueryLoading} from '../lib/apolloHelper';
import {setErrorMessage, renderForError, GraphQLErrorComponent} from '../lib/apolloHelper';
import {WithCreateDraftMutation, WithDraftListQuery} from '../graphql/draft';

//
import DraftCard from '../components/DraftCard';

export class UserDraft extends React.Component {
	state = {
		newDraftID: null
	}

	handleCreate = async () => {
		let data = await this.props.createDraft()
		this.setState({newDraftID: data.data.createDraft._id})
	}

	render() {
		if (this.state.newDraftID) {
			return <Redirect push={true} to={`/edit/${this.state.newDraftID}`}/>;
		}

		return (
			<div>
				<div>
					{
						this.props.draftList.myDrafts.map(draft => (
							<div key={draft._id} className='draft'>
								<DraftCard draft={draft}/>
							</div>
						))
					}
				</div>
				<div className='create'>
					<Button
						raised="raised"
						color="primary"
						onClick={this.handleCreate}
						label='draftCreate'>
						CREATE NEW DRAFT
					</Button>
				</div>

			</div>
		)
	}
}

UserDraft.propTypes = {
	createDraft: PropTypes.func.isRequired,
	draftList: PropTypes.object.isRequired
}

export default compose(
	WithCreateDraftMutation,
	WithDraftListQuery,
	renderWhileLoading(graphQLQueryLoading, "draftList"),
	setErrorMessage("draftList"),
	renderForError(GraphQLErrorComponent, "draftList")

)(UserDraft)
