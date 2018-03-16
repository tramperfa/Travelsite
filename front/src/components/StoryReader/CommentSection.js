import React from 'react'
import PropTypes from 'prop-types'

//
import {ComposeQuery} from '../../lib/hoc'
import {WithStoryCommentQuery} from '../../graphql/story'
import CommentEditorContainer from './comment/CommentEditorContainer'

const CommentSection = ({storyCommentData, match}) => {
	console.log("Story Comment Data:")
	console.log();
	return (
		<div style={{
				margin: '30px 0 50px 0'
			}}>
			<CommentEditorContainer match={match}/>
		</div>
	)
}

CommentSection.propTypes = {
	match: PropTypes.object.isRequired,
	storyCommentData: PropTypes.object.isRequired
}

const CommentSectionWithComposeQuery = ComposeQuery(
	CommentSection,
	'storyCommentData'
)

export default WithStoryCommentQuery(CommentSectionWithComposeQuery)