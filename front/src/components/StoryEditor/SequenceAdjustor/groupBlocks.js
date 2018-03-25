import searchImage from '../../../lib/searchImage'

import CONSTS from '../../../lib/consts'

const BUCKET_NAME = CONSTS.BUCKET_NAME

const groupBlocks = (contentBlockArray, imageArray) => {
	let blockGroups = []
	let i = 0
	blockGroups.push({key: 'empty', title: 'empty', blocks: []})
	for (let block of contentBlockArray) {
		// console.log(block);
		if (block.type === 'atomic') {
			const blockData = block.data.toObject()

			if (blockData.type === 'image') {
				const imageData = searchImage(blockData._id, imageArray)
				const src = BUCKET_NAME + imageData.browserStoryImage.filename
				blockGroups[i].blocks.push({key: block.key, type: blockData.type, src: src})

			} else if (blockData.type === 'video') {
				blockGroups[i].blocks.push(
					{key: block.key, type: blockData.type, src: blockData.src}
				)

			} else { // subTitle
				++i;
				blockGroups[i] = {
					key: block.key,
					title: blockData.title,
					blocks: []
				}
			}
		} else { // text
			if (block.text.length !== 0) {
				const lastBlocks = blockGroups[i].blocks
				if (lastBlocks.length === 0 || lastBlocks[lastBlocks.length - 1].type !== 'unstyled') {
					lastBlocks.push({
						key: block.key,
						type: block.type,
						content: [
							{
								key: block.key,
								text: block.text
							}
						]
					})
				} else {
					lastBlocks[lastBlocks.length - 1].content.push(
						{key: block.key, text: block.text}
					)
				}
			}
		}
	}
	// console.log(blockGroups);
	return blockGroups
}

export default groupBlocks
