import React from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import {compose} from 'recompose';

//
import {WithCreateDraftMutation, WithDraftListQuery} from '../../graphql/draft';
import ComposeQuery from '../../lib/hoc';
import ErrorComp from '../../lib/ErrorComp';
import {error, onError} from '../../lib/utils';

//
import DraftCard from './DraftCard';

export class UserDraft extends React.Component {
	state = {
		newDraftID: null,
		error: error
	}

	handleCreate = () => {
		this.props.createDraft().then((data) => {
			this.setState({newDraftID: data.data.createDraft._id})
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {
		if (this.state.newDraftID) {
			return <Redirect push={true} to={`/my/edit/${this.state.newDraftID}`}/>;
		}

		console.log(this.props.draftList.myDrafts);

		return (
			<div>
				<ErrorComp error={this.state.error}/>
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
						raised={true}
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

const UserDraftWithComposeQuery = ComposeQuery(UserDraft, 'draftList')

export default compose(WithDraftListQuery, WithCreateDraftMutation)(
	UserDraftWithComposeQuery
)
