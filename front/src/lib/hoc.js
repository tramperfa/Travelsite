//import React from 'react';
import {compose} from 'recompose';

//
import {renderWhileLoading, graphQLQueryLoading} from './apollo';
import {setErrorMessage, renderForError, GraphQLErrorComponent} from './apollo';

export const ComposeQuery = (component, propName = "data") => (compose(
	renderWhileLoading(graphQLQueryLoading, propName),
	setErrorMessage(propName),
	renderForError(GraphQLErrorComponent, propName)
)(component))

// export const MyCompose = (componet, { 	...props }) =>
// compose(...props)(componet)

export default ComposeQuery
