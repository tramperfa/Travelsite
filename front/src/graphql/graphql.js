import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
//import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
//import {onError} from "apollo-link-error";

const link = createHttpLink(
	{uri: 'http://localhost:8080/graphql', credentials: 'include'}
)

const cache = new InMemoryCache({
	dataIdFromObject: object => object._id,
	addTypename: true,
	// cacheResolvers: {}, fragmentMatcher: new IntrospectionFragmentMatcher({
	// introspectionQueryResultData: yourData }),
});

const client = new ApolloClient({
	link,
	// use restore on the cache instead of initialState
	cache: cache.restore(window.__APOLLO_CLIENT__),
	ssrMode: true,
	ssrForceFetchDelay: 100,
	connectToDevTools: true,
	queryDeduplication: true
});

export const resetApolloStore = () => {
	client.resetStore()
}

export default client
