import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import Button from 'material-ui/Button'

//
import {WithUserSelfAvatarQuery} from '../../../graphql/user'
import {WithCommentStoryMuation, WithReplyStoryMuation} from '../../../graphql/story'
import ErrorComp from '../../../lib/ErrorComp'
import {error, onError} from '../../../lib/utils'
import {ComposeQuery} from '../../../lib/hoc'
import {EditorState, convertToRaw} from 'draft-js'

import {defaultDecorator} from '../../StoryEditor/decorators/defaultDecorator'
import CONSTS from '../../../lib/consts'
import CommentEditor from "./CommentEditor"
import CommentAvatar from './CommentAvatar'

class CommentEditorContainer extends Component {
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
		if (this.props.hasCommentToReply) {
			console.log("Reply Comment Start");
			console.log(this.props.commentToReply);
			this.props.replyStory(
				convertToRaw(this.state.editorState.getCurrentContent()),
				this.props.match.params._id,
				this.props.commentToReply._id
			).then(() => {
				console.log("Reply Comment Finish");
				this.setState({
					editorState: EditorState.set(
						EditorState.createEmpty(defaultDecorator),
						{allowUndo: false}
					)
				})
			}).catch((err) => {
				this.setState(onError(err))
			})

		} else {
			this.props.commentStory(
				convertToRaw(this.state.editorState.getCurrentContent()),
				this.props.match.params._id,
				false,
				'5aa611d9f874fa00c5250d23'
			).then(() => {
				console.log("Added New Comment");
				this.setState({
					editorState: EditorState.set(
						EditorState.createEmpty(defaultDecorator),
						{allowUndo: false}
					)
				})
			}).catch((err) => {
				this.setState(onError(err))
			})
		}
		this.props.commentReplyFinish()
	}

	render() {
		if (this.props.MeData.userSelf) {
			return (
				<div
					id="comment_editor"
					style={{
						width: CONSTS.STORY_WIDTH,
						height: 310,
						position: 'relative'
					}}>
					<ErrorComp error={this.state.error}/>
					<CommentAvatar user={this.props.MeData.userSelf}/>
					<div
						style={{
							position: 'absolute',
							right: 0,
							top: 0
						}}>
						<CommentEditor
							editorState={this.state.editorState}
							onChange={this.onChange}
							hint={this.props.hasCommentToReply
								? "Reply to " + this.props.commentToReply.author.fullName + ": "
								: "Leave your comment here"}/>
					</div>
					<div className="commentSubmitButton">
						<Button onClick={this.onSubmit}>
							Submit
						</Button>
					</div>
				</div>
			)
		} else {
			return (<div>
				Please log in to leave a comment.
			</div>)
		}
	}
}

CommentEditorContainer.propTypes = {
	MeData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	commentStory: PropTypes.func.isRequired,
	replyStory: PropTypes.func.isRequired
}

const CommentEditorContainerWithComposeQuery = ComposeQuery(
	CommentEditorContainer,
	'MeData'
)

export default compose(
	WithUserSelfAvatarQuery,
	WithCommentStoryMuation,
	WithReplyStoryMuation
)(CommentEditorContainerWithComposeQuery)
