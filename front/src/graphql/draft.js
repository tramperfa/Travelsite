import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {DRAFT_CARD_FRG, DRAFT_IMAGE_ARRAY} from './draftFragment';
import {HEADLINE_IMAGE_FRG} from './imageFragment';

////// QUERY

export const DRAFT_DETAILS_QUERY = gql `
  query DraftQuery($draftID : ID!) {
    draft(draftID: $draftID) {
      ...draftCard
      ...draftImageArray
      content
      headlineImage{
        ...headlineImage
      }
    }
  }
  ${DRAFT_CARD_FRG}
  ${DRAFT_IMAGE_ARRAY}
  ${HEADLINE_IMAGE_FRG}
`;

export const WithDraftDetailsQuery = graphql(DRAFT_DETAILS_QUERY, {
	options: (props) => ({
		variables: {
			draftID: props.match.params._id
		},
		fetchPolicy: 'network-only'
	}),
	name: 'draftData'

})

export const DRAFT_LIST_QUERY = gql `
  query DraftQuery {
    myDrafts {
      ...draftCard
    }
  }
  ${DRAFT_CARD_FRG}
`;

export const WithDraftListQuery = graphql(DRAFT_LIST_QUERY, {
	options: {
		fetchPolicy: 'network-only'
	},
	name: 'draftList'
})

export const DRAFT_IMAGE_ARRAY_QUERY = gql `
query DraftQuery($draftID : ID!) {
  draft(draftID: $draftID) {
    _id
    ...draftImageArray
  }
}
${DRAFT_IMAGE_ARRAY}
`;

/////// MUTATION

export const PUBLISH_DRAFT_MUTATION = gql `
  mutation publishDraft($draftID : ID!) {
    publishDraft(draftID: $draftID) {
      _id
      story
    }
  }
`;

export const WithPublishDraftMutation = graphql(PUBLISH_DRAFT_MUTATION, {
	props: ({mutate}) => ({
		publishDraft: (draftID) => mutate({
			variables: {
				draftID: draftID
			}
		})
	})
})

export const UPDATE_CONTENT_MUTATION = gql `
mutation updateContent($input: updateContentInput!) {
  updateContent(input: $input) {
      _id
      lastUpdate
    }
  }
`;

export const WithUpdateContentMutation = graphql(UPDATE_CONTENT_MUTATION, {
	props: ({mutate}) => ({
		updateContent: (draftID, newContent) => mutate({
			variables: {
				input: {
					draftID: draftID,
					newContent: newContent
				}
			}
		})
	})
})

export const UPDATE_TITLE_MUTATION = gql `
mutation updateTitle($input: updateTitleInput!) {
  updateTitle(input: $input) {
      _id
      title
      #lastUpdate ## Title and Headline are not part of content, do not update time stamp
    }
  }
`;

export const WithUpdateTitleMuation = graphql(UPDATE_TITLE_MUTATION, {
	props: ({mutate}) => ({
		updateTitle: (draftID, newTitle) => mutate({
			variables: {
				input: {
					draftID: draftID,
					newTitle: newTitle
				}
			}
		})
	})
})

export const UPDATE_COVER_MUTATION = gql `
mutation updateCover($input: updateCoverInput!) {
  updateCover(input: $input) {
      _id
      coverImage
    }
  }
`;

export const WithUpdateCoverMuation = graphql(UPDATE_COVER_MUTATION, {
	props: ({mutate}) => ({
		updateCover: (draftID, newCover) => mutate({
			variables: {
				input: {
					draftID: draftID,
					newCover: newCover
				}
			}
		})
	})
})

export const CREATE_DRAFT_MUTATION = gql `
  mutation createDraft($ID: ID){
    createDraft(userID: $ID) {
      _id
      title
  }
}
`;

export const WithCreateDraftMutation = graphql(CREATE_DRAFT_MUTATION, {
	props: ({mutate}) => ({
		createDraft: () => mutate({
			refetchQueries: [
				{
					query: DRAFT_LIST_QUERY
				}
			]
		})
	})
})

export const DELETE_DRAFT_MUTATION = gql `
  mutation deleteDraft($draftID : ID!) {
    deleteDraft(draftID: $draftID) {
      _id
    }
  }
`;

export const WithDeleteDraftMutation = graphql(DELETE_DRAFT_MUTATION, {
	props: ({mutate}) => ({
		deleteDraft: (draftID) => mutate({
			variables: {
				draftID: draftID
			},
			refetchQueries: [
				{
					query: DRAFT_LIST_QUERY
				}
			]
		})
	})
})

export default DRAFT_DETAILS_QUERY
