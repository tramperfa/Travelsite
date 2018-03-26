import React, {Component} from 'react'
import PropTypes from 'prop-types'

//
import {ComposeQuery} from '../../lib/hoc'
import {WithStoryCommentQuery} from '../../graphql/story'
import CommentEditorContainer from './comment/CommentEditorContainer'
import Comment from './comment/Comment'

class CommentSection extends Component {
	state = {
		hasCommentToReply: false,
		commentToReply: null
	}

	onCommentReply = (comment) => {
		console.log(comment);
		this.setState({hasCommentToReply: true, commentToReply: comment})
		// console.log('hasCommentToReply');
		document.getElementById('comment_editor').scrollIntoView(true);
	}

	commentReplyFinish = () => {
		this.setState({hasCommentToReply: false, commentToReply: null})
	}

	onCommentDelete = (comment) => {
		console.log("Comment Delete");
	}

	render() {
		const {storyCommentData, match} = this.props
		console.log("Story Comment Data:")
		console.log(storyCommentData.story.commentReply);
		return (
			<div style={{
					margin: '30px 0 50px 0'
				}}>
				{
					storyCommentData.story.commentReply.map((comment) => {
						return (
							<Comment
								key={comment._id}
								comment={comment}
								MeData={this.props.MeData}
								quoteImage={comment.quoteImage}
								onCommentReply={this.onCommentReply}
								onCommentDelete={this.onCommentDelete}/>
						)
					})
				}
				<CommentEditorContainer
					match={match}
					hasCommentToReply={this.state.hasCommentToReply}
					commentToReply={this.state.commentToReply}
					commentReplyFinish={this.commentReplyFinish}/>
			</div>
		)
	}
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