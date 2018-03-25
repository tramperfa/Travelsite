const delegateResolver = mergeInfo => ({
	Story: {
		author: AuthorFragmentExtend('Story', mergeInfo),
		headlineImage: ImageFragmentExtend('Story', 'headlineImage', mergeInfo),
		coverImage: ImageFragmentExtend('Story', 'coverImage', mergeInfo),
		imageArray: StoryImageArrayFragmentExtend(mergeInfo)
	},
	Draft: {
		author: AuthorFragmentExtend('Draft', mergeInfo),
		headlineImage: ImageFragmentExtend('Draft', 'headlineImage', mergeInfo),
		coverImage: ImageFragmentExtend('Draft', 'coverImage', mergeInfo),
		imageArray: DraftImageArrayFragmentExtend(mergeInfo)
	},
	Comment: {
		author: AuthorFragmentExtend('Comment', mergeInfo),
		quoteImage: ImageFragmentExtend('Comment', 'quoteImage', mergeInfo)
	},
	User: {
		avatar: ImageFragmentExtend('User', 'avatar', mergeInfo)
	},
	PublicUser: {
		avatar: ImageFragmentExtend('PublicUser', 'avatar', mergeInfo)
	}
})

const AuthorFragmentExtend = (type, mergeInfo) => {
	return ({
		fragment: 'fragment AuthorFragment on ' + type + ' {authorID}',
		resolve(parent, args, context, info) {
			const userID = parent.authorID;
			return mergeInfo.delegate('query', 'PublicUserByID', {
				userID
			}, context, info,)
		}

	})
}

const ImageFragmentExtend = (type, extendFieldName, mergeInfo) => {
	let frg = 'fragment ' + extendFieldName + 'Fragment on ' + type + ' {' +
			extendFieldName + 'ID}'
	console.log("FRAGMENT : " + frg);

	return ({
		fragment: frg,
		resolve(parent, args, context, info) {
			let extendFieldID = extendFieldName + 'ID'
			const imageID = parent[extendFieldID];
			return mergeInfo.delegate('query', 'image', {
				imageID
			}, context, info,)
		}
	})
}

const StoryImageArrayFragmentExtend = (mergeInfo) => ({
	fragment: 'fragment ImageArrayFragment on Story {_id}',
	resolve(parent, args, context, info) {
		const storyID = parent._id;
		return mergeInfo.delegate('query', 'imageArrayByStoryID', {
			storyID
		}, context, info,)
	}
})

const DraftImageArrayFragmentExtend = (mergeInfo) => ({
	fragment: 'fragment ImageArrayFragment on Draft {_id}',
	resolve(parent, args, context, info) {
		const draftID = parent._id;
		return mergeInfo.delegate('query', 'imageArrayByDraftID', {
			draftID
		}, context, info,)
	}
})

export default delegateResolver
