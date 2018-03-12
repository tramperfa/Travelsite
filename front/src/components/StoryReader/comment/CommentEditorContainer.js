import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WithUserSelfAvatarQuery} from '../../../graphql/user'
import {ComposeQuery} from '../../../lib/hoc';
import {EditorState, convertToRaw} from 'draft-js'
import Button from 'material-ui/Button'

import {defaultDecorator} from '../../StoryEditor/decorators/defaultDecorator'
import CONSTS from '../../../lib/consts'
import CommentEditor from "./CommentEditor"
import CommentAvatar from './CommentAvatar'

class CommentEditorContainer extends Component {
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
		console.log(convertToRaw(this.state.editorState.getCurrentContent()));
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
	MeData: PropTypes.object.isRequired
}

const CommentEditorContainerWithComposeQuery = ComposeQuery(
	CommentEditorContainer,
	'MeData'
)

export default WithUserSelfAvatarQuery(CommentEditorContainerWithComposeQuery)