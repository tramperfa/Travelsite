import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'
import Button from 'material-ui/Button'

//
import {WithUserSelfAvatarQuery} from '../../../graphql/user'
import {WithCommentStoryMuation} from '../../../graphql/story'
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
		//console.log(convertToRaw(this.state.editorState.getCurrentContent()));
		this.props.commentStory(
			convertToRaw(this.state.editorState.getCurrentContent()),
			this.props.match.params._id,
			false,
			'5aa611d9f874fa00c5250d23'
		).then(() => {
			console.log("Added Comment");
		}).catch((err) => {
			this.setState(onError(err))
		})
	}

	render() {
		if (this.props.MeData.userSelf) {
			return (
				<div
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
							hint="Leave your comment here"/>
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
	commentStory: PropTypes.func.isRequired
}

const CommentEditorContainerWithComposeQuery = ComposeQuery(
	CommentEditorContainer,
	'MeData'
)

export default compose(WithUserSelfAvatarQuery, WithCommentStoryMuation)(
	CommentEditorContainerWithComposeQuery
)
