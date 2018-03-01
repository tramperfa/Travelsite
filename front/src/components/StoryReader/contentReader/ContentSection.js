import React from 'react'
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

const DRAFT_WIDTH = CONSTS.DRAFT_WIDTH
const BUCKET_NAME = CONSTS.BUCKET_NAME

const ContentSection = ({content, images}) => {
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
						src={BUCKET_NAME + imageData.browserStoryImage.filename}
						width={imageData.browserStoryImage.size.width}
						height={imageData.browserStoryImage.size.height}/>
				} else {
					return <SubTitleBlock blockKey={keys[i]} title={data[i].title}/>
				}
			})
		},
		decorators: [
			{
				strategy: emojiStrategy,
				component: ({children, decoratedText}) => <ReaderEmojiSpan key={decoratedText} decoratedText={decoratedText}/>
			}
		]
	}

	const converted = redraft(content, rederers)
	if (!converted) {
		return (<div>Error in content rendering</div>)
	}
	const subTitleList = getSubTitleList(content)
	getSubTitleList(content)
	return (
		<div className="storyWrapper">
			<div className="storyReader" style={{
					width: DRAFT_WIDTH
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
			<ScrollTools/>
		</div>
	)
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
