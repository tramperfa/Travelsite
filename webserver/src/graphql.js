

import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';

import { schema } from './schema';


module.exports = function(app, db) {

app.use("/graphql", graphqlExpress( (req) => {
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error("Query too large.");
  }
  // logger.debug("GraphQL request:", query);

  return {
    schema: schema,
    context: {
      session: req.session,
      t: req.t
    },
    formatError(e) {
      return {
        status: e.originalError ? e.originalError.status : 400,
        type: e.originalError ? e.originalError.type : null,
        message: e.message,
        locations: e.locations,
        path: e.path
      };
    }
  };

}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

};
