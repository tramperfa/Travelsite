const delegateResolver = mergeInfo => ({
	Story: {
		author: {
			fragment: 'fragment AuthorFragment on Story {authorID}',
			resolve(parent, args, context, info) {
				const userID = parent.authorID;
				console.log("userID");
				console.log(userID);
				return mergeInfo.delegate('query', 'PublicUserByID', {
					userID
				}, context, info,)
			}
		}
	},
	Comment: {
		author: {
			fragment: 'fragment CommentAuthorFragment on Comment {authorID}',
			resolve(parent, args, context, info) {
				//console.log("DELEGATE TO COMMETAUTHOR");
				const userID = parent.authorID;
				return mergeInfo.delegate('query', 'PublicUserByID', {
					userID
				}, context, info,)
			}
		}
	}
})

export default delegateResolver
