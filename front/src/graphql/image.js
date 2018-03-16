import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

import reduxStore from '../redux';
import client from '../graphql/graphql';
import {HEADLINE_IMAGE_FRG, AVATAR_IMAGE_FRG} from './imageFragment';
import {USER_AVATAR_FRG} from './userFragment';
import {DRAFT_DETAILS_QUERY} from './draft';

const CROP_IMAGE_MUTATION = gql `
mutation cropImage($input: cropImageInput!) {
  cropImage(input: $input) {
      ...headlineImage
      ...avatarImage
      draft
    }
  }
${HEADLINE_IMAGE_FRG}
${AVATAR_IMAGE_FRG}
`;

export const WithCropHeadlineImageMutation = graphql(CROP_IMAGE_MUTATION, {
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

export const WithCropAvatarImageMutation = graphql(CROP_IMAGE_MUTATION, {
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
				// get my userID from Redux
				const myID = reduxStore.getState().userLocalStore.me._id;
				// read out fragements from cache
				var userAvatarFrg = client.readFragment(
					{id: myID, fragment: USER_AVATAR_FRG, fragmentName: "userAvatar"}
				)
				// console.log("userAvaFrg ; "); console.log(userAvatarFrg);
				// ///////////////////////////////////////////////////////////// / var
				// publicUserAvatarFrg = client.readFragment( 	{id: myID, fragment:
				// PUBLIC_USER_SNAPSHOT_FRG, fragmentName: "publicUserSnapshot"} )
				// console.log("publicuserAvaFrg ; "); console.log(publicUserAvatarFrg); change
				// avatar image
				userAvatarFrg.avatar = cropImage;
				//publicUserAvatarFrg.avatar = cropImage; write fragements back to cache
				client.writeFragment(
					{id: myID, fragment: USER_AVATAR_FRG, fragmentName: "userAvatar", data: userAvatarFrg}
				)

			}
		})
	})
})

export default CROP_IMAGE_MUTATION
