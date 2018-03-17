import React, {Component} from 'react'
import {EditorState, convertToRaw} from 'draft-js'
import {compose} from 'recompose'
import PropTypes from 'prop-types'
import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Done from 'material-ui-icons/Done'
import Clear from 'material-ui-icons/Clear'

import {defaultDecorator} from '../../StoryEditor/decorators/defaultDecorator'
import {WithCommentStoryMuation} from '../../../graphql/story'
import ErrorComp from '../../../lib/ErrorComp'
import {error, onError} from '../../../lib/utils'
import CommentEditor from './CommentEditor'
import CommentImage from './CommentImage'

class CommentImageContainer extends Component {
	state = {
		editorState: EditorState.set(
			EditorState.createEmpty(defaultDecorator),
			{allowUndo: false}
		),
		error: error
	}

	onChange = (editorState) => {
		this.setState({editorState: editorState})
	}

	onSubmit = () => {
		console.log(this.props.commentImageId);
		// console.log(convertToRaw(this.state.editorState.getCurrentContent()));

		this.props.commentStory(
			convertToRaw(this.state.editorState.getCurrentContent()),
			this.props.match.params._id,
			true,
			this.props.commentImageId
		).then(() => {
			console.log("Added New Image Comment");
			this.setState({
				editorState: EditorState.set(
					EditorState.createEmpty(defaultDecorator),
					{allowUndo: false}
				)
			})
			this.props.closeImageComment()
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {
		return (
			<div>
				<ErrorComp error={this.state.error}/>
				<Dialog
					classes={{
						paper: this.props.classes.dialog
					}}
					open={this.props.open}
					onClose={this.props.closeImageComment}
					disableBackdropClick={true}
					disableEscapeKeyDown={true}
					maxWidth={false}>
					<DialogContent>
						<CommentImage imageData={this.props.commentImage}/>
						<div style={{
								marginTop: 16
							}}>
							<CommentEditor
								editorState={this.state.editorState}
								onChange={this.onChange}
								hint="Comment this image here"/>
						</div>
					</DialogContent>
					<DialogActions>
						<div className="dialogActionItem">
							<Button color="primary" onClick={this.onSubmit}>
								<Done/>
							</Button>
						</div>
						<div className="dialogActionItem">
							<Button color="primary" onClick={this.props.closeImageComment}>
								<Clear/>
							</Button>
						</div>
					</DialogActions>
				</Dialog>
			</div>

		)
	}
}

CommentImageContainer.propTypes = {
	match: PropTypes.object.isRequired,
	commentStory: PropTypes.func.isRequired
}

const styles = theme => ({dialog: {}})

export default compose(withStyles(styles), WithCommentStoryMuation)(
	CommentImageContainer
)
