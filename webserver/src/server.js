import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';


import { schema } from './schema';

const PORT = 4000;
const server = express();
const MongoClient = mongodb.MongoClient;

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
);


// Talk to Mongo

MongoClient.connect('mongodb://mongodb:27017', function (err, db) {
  if (err) throw err
  console.log('Connected to MongoDB at port 27017!');
});
