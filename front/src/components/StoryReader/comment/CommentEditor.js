import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Editor, EditorState, Modifier} from 'draft-js';

import 'draft-js/dist/Draft.css'

import EmojiInsert from '../../StoryEditor/sidebar/EmojiInsert'

class CommentEditor extends Component {

	onClick = () => {
		this.editor.focus()
	}

	addEmoji = (emojiName) => {
		const emojiString = '{' + emojiName + '}'
		// console.log(emojiString);
		const contantState = this.props.editorState.getCurrentContent()
		const selectionState = this.props.editorState.getSelection()
		const contentStateWithEmoji = Modifier.insertText(
			contantState,
			selectionState,
			emojiString
		)
		const editorStateWithEmoji = EditorState.push(
			this.props.editorState,
			contentStateWithEmoji,
			'insert-characters'
		)
		this.props.onChange(editorStateWithEmoji)
	}
	render() {
		return (
			<div>
				<div className="commentEditorWrapper">
					<div className="commentActionBar">
						<EmojiInsert onEmojiClick={this.addEmoji}/>
					</div>
					<div className="commentEditor" onClick={this.onClick}>
						<Editor
							editorState={this.props.editorState}
							onChange={this.props.onChange}
							placeholder={this.props.hint}
							ref={(element) => {
								this.editor = element
							}}/>
					</div>
				</div>
			</div>
		)
	}
}

CommentEditor.propTypes = {
	editorState: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired
}

export default CommentEditor
