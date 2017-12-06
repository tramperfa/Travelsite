import gql from 'graphql-tag';
import {HEADLINE_IMAGE_FRG} from './imageFragment';

////// QUERY / MUTATION

export const CropImageMutation = gql `
mutation cropImage($input: cropImageInput!) {
  cropImage(input: $input) {
      ...headlineImage
      draft
    }
  }
${HEADLINE_IMAGE_FRG}
`;

export default CropImageMutation
