import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import TextField from 'material-ui/TextField';

class StoryTitle extends React.Component {
	state = {
		title: this.props.title
			? this.props.title
			: ''
	}

	handleTitleUpdate = async () => {
		try {
			await this.props.updateTitle(this.props.match.params._id, this.state.title)
		} catch (e) {
			//this.setState({errorMessage: e.graphQLErrors[0].message})
			console.log();
		} finally {}
	}

	handleChange = name => event => {
		this.setState({[name]: event.target.value});
	}

	render() {
		return (
			<TextField
				inputProps={{
					maxLength: 60
				}}
				id="title"
				helperText={60 - this.state.title.length + " letters avaliable"}
				onBlur={this.handleTitleUpdate}
				fullWidth={true}
				placeholder="Title contains up to 60 letters"
				label="Title"
				value={this.state.title}
				onChange={this.handleChange('title')}/>
		)
	}

}

StoryTitle.propTypes = {
	updateTitle: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired
}

export const UpdateTitleMutation = gql `
mutation updateTitle($input: updateTitleInput!) {
  updateTitle(input: $input) {
      _id
      title
      lastUpdate
    }
  }
`;

export const WithTitleMuation = graphql(UpdateTitleMutation, {
	props: ({mutate}) => ({
		updateTitle: (draftID, newTitle) => mutate({
			variables: {
				input: {
					draftID: draftID,
					newTitle: newTitle
				}
			}
		})
	})
})

export default WithTitleMuation(StoryTitle)