import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {HEADLINE_IMAGE_FRG} from './imageFragment';
import {DRAFT_DETAILS_QUERY} from './draft';

////// QUERY / MUTATION

export const CROP_IMAGE_MUTATION = gql `
mutation cropImage($input: cropImageInput!) {
  cropImage(input: $input) {
      ...headlineImage
      draft
    }
  }
${HEADLINE_IMAGE_FRG}
`;

export const WithCropImageMutation = graphql(CROP_IMAGE_MUTATION, {
	props: ({mutate}) => ({
		cropImage: (imageID, x, y, width, heigth) => mutate({
			variables: {
				input: {
					imageID: imageID,
					x: x,
					y: y,
					width: width,
					height: heigth
				}
			},
			update: (store, {data: {
					cropImage
				}}) => {
				// Read the data from the cache for this query.
				const data = store.readQuery({
					query: DRAFT_DETAILS_QUERY,
					variables: {
						draftID: cropImage.draft
					}
				});
				// change headline image.
				data.draft.headlineImage = cropImage
				// Write the data back to the cache.
				store.writeQuery({
					query: DRAFT_DETAILS_QUERY,
					variables: {
						draftID: cropImage.draft
					},
					data
				});

			}
		})
	})
})

export default CROP_IMAGE_MUTATION
