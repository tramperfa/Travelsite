import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';

import { schema } from './schema';

const PORT = 8080;
const server = express();



server.use('*', cors({ origin: 'http://localhost:3000' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.get('/', function (req, res) {
  res.send('Hello Boyang!')
})


server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
  console.log(`GraphiQL UI is now up on http://localhost:${PORT}/graphiql`)
});
