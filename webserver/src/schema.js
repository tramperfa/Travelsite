import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';



export const typeDefs = `
scalar JSON
scalar Url
scalar Date

type Story{
  storyID: ID!
  storyName: String!
  snapshotContent: String
  coverPhoto(size: PhotoSize): Url
  authorID: ID
  authorName: String
  authorAvatar(size: PhotoSize): Url
  date: Date
  destinationID: ID
  destinationName: String
  viewCount: Int
  replyCout: Int
  likeCount: Int
  hidden: Boolean
  content: JSON
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



const schema = makeExecutableSchema({ typeDefs, resolvers});
export { schema };
