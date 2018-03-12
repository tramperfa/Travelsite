import React, {Component} from 'react'
import {EditorState, convertToRaw} from 'draft-js'
import Dialog, {DialogActions, DialogContent} from 'material-ui/Dialog'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Done from 'material-ui-icons/Done'
import Clear from 'material-ui-icons/Clear'

import {defaultDecorator} from '../../StoryEditor/decorators/defaultDecorator'
import CommentEditor from './CommentEditor'
import CommentImage from './CommentImage'

class CommentImageContainer extends Component {
	state = {
		editorState: EditorState.set(
			EditorState.createEmpty(defaultDecorator),
			{allowUndo: false}
		)
	}

	onChange = (editorState) => {
		this.setState({editorState: editorState})
	}

	onSubmit = () => {
		console.log(this.props.commentImageId);
		console.log(convertToRaw(this.state.editorState.getCurrentContent()));
		this.props.closeImageComment()
	}

	render() {
		return (
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
		)
	}
}

const styles = theme => ({dialog: {}})

export default withStyles(styles)(CommentImageContainer)
