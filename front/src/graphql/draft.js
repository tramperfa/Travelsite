import gql from 'graphql-tag';
import {DRAFT_CARD_FRG, DRAFT_IMAGE_ARRAY} from './draftFragment';
import {HEADLINE_IMAGE_FRG} from './imageFragment';

////// QUERY

export const DraftDetailsQuery = gql `
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

export const draftsListQuery = gql `
  query DraftQuery {
    myDrafts {
      ...draftCard
    }
  }
  ${DRAFT_CARD_FRG}
`;

export const draftImageArrayQuery = gql `
query DraftQuery($draftID : ID!) {
  draft(draftID: $draftID) {
    _id
    ...draftImageArray
  }
}
${DRAFT_IMAGE_ARRAY}
`;

/////// MUTATION

export const PublishDraftMutation = gql `
  mutation publishDraft($draftID : ID!) {
    publishDraft(draftID: $draftID) {
      _id
      story
    }
  }
`;

export const UpdateContentMutation = gql `
mutation updateContent($input: updateContentInput!) {
  updateContent(input: $input) {
      _id
      lastUpdate
    }
  }
`;

export const UpdateTitleMutation = gql `
mutation updateTitle($input: updateTitleInput!) {
  updateTitle(input: $input) {
      _id
      title
      #lastUpdate ## Title and Headline are not part of content, do not update time stamp
    }
  }
`;

export const createDraftMutation = gql `
  mutation createDraft($ID: ID){
    createDraft(userID: $ID) {
      _id
      title
  }
}
`;

export const DeleteDraftMutation = gql `
  mutation deleteDraft($draftID : ID!) {
    deleteDraft(draftID: $draftID) {
      _id
    }
  }
`;

export default DraftDetailsQuery
