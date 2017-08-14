import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

export const typeDefs = `

scalar Url
scalar Content
scalar Date

type Story{
  storyID: ID!
  storyName: String!
  snapshotContent: String
  coverPhoto(size: PhotoSize): Url
  authorID: ID
  authorName: String
  authorAvatar(size: PhotoSize): Url
  publishTime: Date
  destinationID: ID
  destinationName: String
  viewCount: Int
  replyCout: Int
  likeCount: Int
  content: Content
}



enum PhotoSize {
  ORIGINAL
  LARGE
  MEDIUM
  SMALL
  XSMALL
}

type Query {
  story(storyID: ID!): Story
  stories: [Story]
  #storyList(type: $type, offset: $offset, limit: Int = 10) [Story]
}

type Mutation {
  addStory(storyName: String!): Story
}

`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
