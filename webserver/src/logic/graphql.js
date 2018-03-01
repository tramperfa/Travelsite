import {graphqlExpress, graphiqlExpress} from 'graphql-server-express';
import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';
import {directiveResolvers} from './directives'
import {attachDirectiveResolvers} from 'graphql-tools';
import depthLimit from 'graphql-depth-limit'
const resolvers = require('./resolvers');
import typeDefs from './types';

const schema = makeExecutableSchema({typeDefs, resolvers});

//console.log(typeDefs);

attachDirectiveResolvers(schema, directiveResolvers)

module.exports = function (app, db) {
	app.use("/graphql", graphqlExpress((req) => {
		console.log("GraphQL Requst is using sessionID :" + req.sessionID);
		//console.log(req.session)
		const query = req.query.query || req.body.query;
		if (query && query.length > 2000) {
			// None of our app's queries are this long Probably indicates someone trying to
			// send an overly expensive query
			throw new Error("Query too large.");
		}
		// logger.debug("GraphQL request:", query);

		return {
			schema: schema,
			// Limit Maximum Query Depth to 10 to Avoid Vicious Nested Queries
			validationRules: [depthLimit(10)],
			context: {
				sessionUser: req.session.passport,
				req: req
			},
			formatError(error) {
				return {message: error.message, path: error.path};
			}
		};
	}));

	app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

};
