import {graphqlExpress, graphiqlExpress} from "graphql-server-express"
import {makeExecutableSchema, mergeSchemas} from "graphql-tools"
import {directiveResolvers} from "./directives"
import {attachDirectiveResolvers} from "graphql-tools"
import depthLimit from "graphql-depth-limit"
import resolvers from './resolvers'
import typeDefs from "./types"
import linkTypeDefs from './linkTypeDefs'
import delegateResolver from './delegateResolver'

//console.log(typeDefs);

const schema = makeExecutableSchema({typeDefs, resolvers})
attachDirectiveResolvers(schema, directiveResolvers)

const schemaStitched = mergeSchemas({
	schemas: [
		schema, linkTypeDefs
	],
	resolvers: delegateResolver
});

module.exports = function (app) {
	app.use("/graphql", graphqlExpress((req) => {
		console.log("GraphQL Requst is using sessionID :" + req.sessionID)
		//console.log(req.session)
		const query = req.query.query || req.body.query
		if (query && query.length > 2000) {
			// None of our app's queries are this long Probably indicates someone trying to
			// send an overly expensive query
			throw new Error("Query too large.")
		}
		// logger.debug("GraphQL request:", query);

		return {
			schema: schemaStitched,
			// Limit Maximum Query Depth to 10 to Avoid Vicious Nested Queries
			validationRules: [depthLimit(10)],
			context: {
				sessionUser: req.session.passport,
				req: req
			},
			formatError(error) {
				return {message: error.message, path: error.path}
			}
		}
	}))

	app.use("/graphiql", graphiqlExpress({endpointURL: "/graphql"}))

}
