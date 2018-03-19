import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

//
import {WithUpdateTitleMuation} from '../../graphql/draft';
import ErrorComp from '../../lib/ErrorComp'
import {error, onError} from '../../lib/utils'

class StoryTitle extends React.Component {
	state = {
		title: this.props.title
			? this.props.title
			: '',
		error: error
	}

	handleTitleUpdate = () => {
		this.props.updateTitle(this.props.match.params._id, this.state.title).then(
			() => {}
		).catch((err) => {
			this.setState(onError(err))
		})
	}

	handleChange = name => event => {
		this.setState({[name]: event.target.value});
	}

	render() {
		return (
			<div className='storyTitle'>
				<ErrorComp error={this.state.error}/>
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
			</div>
		)
	}
}

StoryTitle.propTypes = {
	updateTitle: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired
}

export default WithUpdateTitleMuation(StoryTitle)