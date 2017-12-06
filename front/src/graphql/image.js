import gql from 'graphql-tag';

////// QUERY ///// MUTATION

export const CropImageMutation = gql `
mutation cropImage($input: cropImageInput!) {
  cropImage(input: $input) {
      _id
      draft
      originalImage {
        filename
        size {
          width
          height
        }
      }
      browserHeadlineImage {
        filename
        size {
          width
          height
        }
      }
      # browserHeadlineImage
      # browserStoryImage
      # browserCommentImage
      # browserCoverImage
      # browserUserHomeCoverImage

    }
  }
`;

export default CropImageMutation
