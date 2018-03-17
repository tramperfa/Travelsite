import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {STORY_CARD_FRG, STORY_IMAGE_ARRAY_FRG, STORY_COMMENT_FRG} from './storyFragment';
import {HEADLINE_IMAGE_FRG} from './imageFragment';

////// QUERY

export const STORY_DETAILS_QUERY = gql `
  query StoryQuery($_id : ID!) {
    story(_id: $_id) {
      ...storyCard
      content
      draft
      headlineImage{
        ...headlineImage
      }
      ...storyImageArray
    }
  }
  ${STORY_CARD_FRG}
  ${HEADLINE_IMAGE_FRG}
  ${STORY_IMAGE_ARRAY_FRG}
`;

export const WithStoryDetialsQuery = graphql(STORY_DETAILS_QUERY, {
	options: (props) => ({
		variables: {
			_id: props.match.params._id
		}
	}),
	name: 'storyDetailData'
})

export const STORIES_LIST_QUERY = gql `
  query popularStoryQuery {
    stories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const WithStoryListQuery = graphql(STORIES_LIST_QUERY)

export const STORY_COMMENT_QUERY = gql `
query StoryQuery($_id : ID!) {
  story(_id: $_id) {
      _id
      commentReply{
        ...storyComment
      }
    }
  }
${STORY_COMMENT_FRG}
`;

export const WithStoryCommentQuery = graphql(STORY_COMMENT_QUERY, {
	options: (props) => ({
		variables: {
			_id: props.match.params._id
		}
	}),
	name: 'storyCommentData'
})

export const USER_STORY_QUERY = gql `
  query userStoryQuery($userID : ID!) {
    userStories(userID: $userID) {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const WithUserStoryQuery = graphql(USER_STORY_QUERY, {
	options: (props) => ({
		variables: {
			userID: props.match.params._id
		},
		fetchPolicy: 'network-only'
	}),

	name: 'userStoryData'
})

export const MY_DELETE_STORY_QUERY = gql `
  query myDeleteStoryQuery {
    myDeletedStories {
      ...storyCard
    }
  }
${STORY_CARD_FRG}
`;

export const WithMyDeleteStoryQuery = graphql(MY_DELETE_STORY_QUERY, {
	options: {
		fetchPolicy: 'network-only'
	},
	name: 'myDeleteStoryData'
})

/////// MUTATION

export const LIKE_STORY_MUTATION = gql `
  mutation likeStory($storyID : ID!) {
    likeStory(storyID: $storyID) {
      _id
      likeStoryCount
      lastUpdate
    }
  }
`;

export const WithLikeStoryMutation = graphql(LIKE_STORY_MUTATION, {
	props: ({mutate}) => ({
		likeStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			}
		})
	})
})

export const ARCHIVE_STORY_MUTATION = gql `
  mutation archiveStory($storyID : ID!) {
    archiveStory(storyID: $storyID) {
      _id
      archiveStoryCount
      lastUpdate
    }
  }
`;

export const WithArchiveStoryMutation = graphql(ARCHIVE_STORY_MUTATION, {
	props: ({mutate}) => ({
		archiveStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			}
		})
	})
})

export const DELETE_STORY_MUTATION = gql `
  mutation deleteStory($storyID : ID!) {
    deleteStory(storyID: $storyID) {
      _id
      lastUpdate
    }
  }
`;

//NO REFETCH NEEDED
export const WithDeleteStoryMutation = graphql(DELETE_STORY_MUTATION, {
	props: ({mutate}) => ({
		deleteStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			}
		})
	})
})

export const RECOVER_STORY_MUTATION = gql `
  mutation recoverStory($storyID : ID!) {
    recoverStory(storyID: $storyID) {
      _id
    }
  }
`;

//NO REFETCH NEEDED
export const WithRecoverStoryMutation = graphql(RECOVER_STORY_MUTATION, {
	props: ({mutate}) => ({
		recoverStory: (storyID) => mutate({
			variables: {
				storyID: storyID
			},
			refetchQueries: [
				{
					query: MY_DELETE_STORY_QUERY
				}
			]
		})
	})
})

////\\\\\\\\\\\\\\  COMMENTS \\\\\\\\\\\\\\
export const COMMENT_STORY_MUTATION = gql `
mutation commentStory($input: commentStoryInput!) {
  commentStory(input: $input) {
      ...storyComment
    }
  }
  ${STORY_COMMENT_FRG}
`;

export const WithCommentStoryMuation = graphql(COMMENT_STORY_MUTATION, {
	props: ({mutate}) => ({
		commentStory: (content, storyID, quoteImage, imageID) => mutate({
			variables: {
				input: {
					content: content,
					storyID: storyID,
					quoteImage: quoteImage,
					imageID: imageID
				}
			},
			update: (store, {data: {
					commentStory
				}}) => {
				console.log("CommentSTORY");
				console.log(commentStory);

				//storyComment Query is the only query impacted by the mutation
				const data = store.readQuery({
					query: STORY_COMMENT_QUERY,
					variables: {
						_id: commentStory.storyID
					}
				});

				console.log("DATA :");
				console.log(data);

				//Add the new Comment
				data.story.commentReply.push(commentStory)

				//Write back
				store.writeQuery({
					query: STORY_COMMENT_QUERY,
					variables: {
						_id: commentStory.storyID
					},
					data
				})
			}
		})
	})
})

export default RECOVER_STORY_MUTATION
