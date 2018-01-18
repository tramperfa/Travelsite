import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {STORY_CARD_FRG, STORY_IMAGE_ARRAY} from './storyFragment';

////// QUERY

export const STORY_DETAILS_QUERY = gql `
  query StoryQuery($_id : ID!) {
    story(_id: $_id) {
      ...storyCard
      content
      ...storyImageArray
    }
  }
  ${STORY_CARD_FRG}
  ${STORY_IMAGE_ARRAY}
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
  query poularStoryQuery {
    stories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const WithStoryListQuery = graphql(STORIES_LIST_QUERY)

export const MY_STORY_QUERY = gql `
  query myStoryQuery {
    myStories {
      ...storyCard
    }
  }
  ${STORY_CARD_FRG}
`;

export const MY_DELETE_STORY_QUERY = gql `
  query myDeleteStoryQuery {
    myDeletedStories {
      ...storyCard
    }
  }
${STORY_CARD_FRG}
`;

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

export default RECOVER_STORY_MUTATION
