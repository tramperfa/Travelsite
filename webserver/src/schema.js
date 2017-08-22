
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';



export const typeDefs = `
scalar JSON
scalar Url
scalar Date



type User {
  _id: ID!
  name: String
  avatar(size: PhotoSize): Url
}

type POI {
  _id: ID!
  name: String
}

type Image {
  _id: ID!
  size: PhotoSize
}

type Commnet {
  text: String
}

type Story {
  _id: ID!
  title: String!
  snapshotContent: String
  content: JSON
  cover: Image
  user: ID
  lastUpdate: Date
  viewCount: Int
  likeCount: Int
  commentCount: Int
  hidden: Boolean
}



enum PhotoSize {
  ORIGINAL
  LARGE
  MEDIUM
  SMALL
  XSMALL
}

type Query {
  story(_id: ID!): Story
  stories: [Story]
  #storyList(type: $type, offset: $offset, limit: Int = 10) [Story]
}



type Mutation {
  createDraft(input: createDraftInput!): Story
  updateTitle(input: updateTitleInput!): Story

}

input createDraftInput {
  user_id: ID!
}

input updateTitleInput {
  storyID: ID!
  newTitle: String!
}

`;



// updateCover(input: updateCoverInput!): updateCoverPayload
// updateContent(input: updateContentInput!): updateContentPayload
// publishStory(input: publishStoryInput!): publishStoryPayload
// addComment(input: addCommentInput!): addCommentPayload
// removeComment(input: removeCommentInput!): removeCommentPayload
// toggleLike(input: toggleLikeInput!): toggleLikePayload
// uploadImage(input: uploadImageInput!): uploadImagePayload


const schema = makeExecutableSchema({ typeDefs, resolvers});
export { schema };
