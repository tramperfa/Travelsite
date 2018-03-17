import React, {Component} from 'react'
import redraft from 'redraft'

import '../../BlockStyles.css'

import VideoBlock from './VideoBlock'
import ImageBlock from './ImageBlock'
import SubTitleBlock from './SubTitleBlock'
import SubTitleList from './SubTitleList'
import ScrollTools from '../../StoryEditor/ScrollTools'
import searchImage from '../../../lib/searchImage'
import CONSTS from '../../../lib/consts'

import {emojiStrategy} from '../../StoryEditor/decorators/emojiStrategy'
import ReaderEmojiSpan from './ReaderEmojiSpan'
import CommentImageContainer from '../comment/CommentImageContainer'

const STORY_WIDTH = CONSTS.STORY_WIDTH
const BUCKET_NAME = CONSTS.BUCKET_NAME

class ContentSection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			commentImageOpen: false,
			commentImageId: null
		}
	}

	onImageComment = (_id) => {
		this.setState({commentImageOpen: true, commentImageId: _id})
	}

	closeImageComment = () => {
		this.setState({commentImageOpen: false, commentImageId: null})
	}

	render() {
		const {content, images} = this.props
		if (!content) {
			return (<div>Empty Content</div>)
		}

		const rederers = {
			blocks: {
				unstyled: (children) => children.map(child => <p>{child}</p>),
				atomic: (children, {keys, data}) => children.map((child, i) => {
					if (data[i].type === "video") {
						return <VideoBlock src={data[i].src}/>
					} else if (data[i].type === "image") {
						const imageData = searchImage(data[i]._id, images)
						return <ImageBlock
							_id={data[i]._id}
							src={BUCKET_NAME + imageData.browserStoryImage.filename}
							width={imageData.browserStoryImage.size.width}
							height={imageData.browserStoryImage.size.height}
							onImageComment={this.onImageComment}/>
					} else {
						return <SubTitleBlock blockKey={keys[i]} title={data[i].title}/>
					}
				})
			},
			decorators: [
				{
					strategy: emojiStrategy,
					component: ({children, decoratedText}) => <ReaderEmojiSpan
							key={Math.floor(Math.random() * 1000)}
							decoratedText={decoratedText}/>
				}
			]
		}

		const converted = redraft(content, rederers)
		if (!converted) {
			return (<div>Error in content rendering</div>)
		}
		const subTitleList = getSubTitleList(content)
		const commentedImage = searchImage(this.state.commentImageId, images)

		return (
			<div className="storyWrapper">
				<div className="storyReader" style={{
						width: STORY_WIDTH
					}}>
					{
						converted.map(
							(element, index) => <div key={index}>
								{element.map((e, i) => <div key={i}>{e}</div>)}
							</div>
						)
					}
				</div>
				<div className="sidebarWrapper">
					<SubTitleList subTitleList={subTitleList}/>
				</div>
				<ScrollTools/> {
					commentedImage && <CommentImageContainer
							open={this.state.commentImageOpen}
							closeImageComment={this.closeImageComment}
							commentImageId={this.state.commentImageId}
							commentImage={commentedImage.browserCommentImage}
							match={this.props.match}/>
				}
			</div>
		)
	}
}

const getSubTitleList = (content) => {
	let subTitleBlocks = content.blocks.filter((block) => {
		return (block.type === 'atomic' && block.data.type === 'subTitle')
	})

	let subTitleList = subTitleBlocks.map((block) => {
		return {key: block.key, title: block.data.title}
	})
	return subTitleList
}

export default ContentSection
