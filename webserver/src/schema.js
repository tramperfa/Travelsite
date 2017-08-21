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

input UserInput {
  name: String
}

type POI {
  _id: ID!
  name: String
}

type Story {
  _id: ID!
  title: String!
  snapshotContent: String
  content: JSON
  coverPhoto(size: PhotoSize): Url
  user: User
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
  createStory(user_id: String): Story
}

`;

//  createStory(user: UserInput): Story

const schema = makeExecutableSchema({ typeDefs, resolvers});
export { schema };
