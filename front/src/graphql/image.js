import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

import store from '../redux';
import client from '../graphql/graphql';
import {HEADLINE_IMAGE_FRG, AVATAR_IMAGE_FRG} from './imageFragment';
import {USER_AVATAR_FRG} from './userFragment';
import {PUBLIC_USER_SNAPSHOT_FRG, PUBLIC_USER_FRG} from './publicUserFragment';
import {DRAFT_DETAILS_QUERY} from './draft';
import {PUBLIC_USER_BY_ID_QUERY} from './publicUser';

const reduxStore = store;
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
				const myID = reduxStore.getState().userLocalStore.me._id;
				// console.log("myID : "); console.log(myID);

				var userAvatarFrg = client.readFragment(
					{_id: myID, fragment: USER_AVATAR_FRG, fragmentName: "userAvatar"}
				)
				console.log("userAvaFrg ; ");
				console.log(userAvatarFrg);

				var publicUserAvatarFrg = client.readFragment(
					{_id: myID, fragment: PUBLIC_USER_SNAPSHOT_FRG, fragmentName: "publicUserSnapshot"}
				)
				console.log("publicuserAvaFrg ; ");
				console.log(publicUserAvatarFrg);

				var data = store.readQuery({
					query: PUBLIC_USER_BY_ID_QUERY,
					variables: {
						userID: myID
					}
				});

				console.log("Query Data :");
				console.log(data);

				// TODO UPDATE AVATAR FRG  Read the data from the cache for this query. const
				// data = store.readQuery({ 	query: USER_SELF_QUERY, 	variables: { userID:
				// "MYSELF" 	} });  change avatar image. data.userSelf.avatar = cropImage  Write
				// the data back to the cache. store.writeQuery({ 	query: USER_SELF_QUERY,
				// variables: { 		userID: "MYSELF" 	}, 	data });

			}
		})
	})
})

export default CROP_IMAGE_MUTATION
