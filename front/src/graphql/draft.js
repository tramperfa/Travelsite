import gql from 'graphql-tag';

////// QUERY

export const DraftDetailsQuery = gql `
  query DraftQuery($draftID : ID!) {
    draft(draftID: $draftID) {
      _id
      title
      content
      author{
        _id
        fullName
      }
      headlineImage{
        _id
        browserHeadlineImage{
          filename
        }
        originalImage{
          filename
        }
      }
      lastUpdate
      images{
        _id
        browserStoryImage{
          filename
          size{
            width
            height
          }
        }
      }
    }
  }
`;

export const draftsListQuery = gql `
  query DraftQuery {
    myDrafts {
      _id
      title
      author{
        _id
        fullName
      }
      headlineImage{
        _id
        browserHeadlineImage{
          filename
        }
      }
      lastUpdate
    }
  }
`;

export const draftImageArrayQuery = gql `
query DraftQuery($draftID : ID!) {
  draft(draftID: $draftID) {
    _id
    images{
      _id
      browserStoryImage{
        filename
        size{
          width
          height
        }
      }
    }
  }
}
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
      #lastUpdate
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
