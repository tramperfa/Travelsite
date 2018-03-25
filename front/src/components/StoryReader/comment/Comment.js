import React, {Component} from 'react'

import '../../BlockStyles.css'
import CONSTS from '../../../lib/consts'
import CommentAuthorInfo from './CommentAuthorInfo'
import CommentContent from './CommentContent'
import CommentBottomBar from './CommentBottomBar'

const STORY_WIDTH = CONSTS.STORY_WIDTH

export default class Comment extends Component {

	onReply = () => {
		this.props.onCommentReply(this.props.comment)
	}

	onDelete = () => {
		this.props.onCommentDelete(this.props.comment)
	}

	render() {
		const {comment, quoteImage} = this.props
		return (
			<div
				style={{
					width: STORY_WIDTH,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-end',
					marginBottom: 24
				}}>
				<CommentAuthorInfo author={comment.author}/>
				<CommentContent comment={comment} quoteImage={quoteImage}/>
				<CommentBottomBar
					commentAuthor={comment.author}
					publishTime={comment.publishTime}
					onReply={this.onReply}
					onDelete={this.onDelete}
					MeData={this.props.MeData}/>
			</div>
		)
	}

}
