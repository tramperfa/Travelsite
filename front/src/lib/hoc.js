//import React from 'react';
import {compose} from 'recompose';

//
import {renderWhileLoading, graphQLQueryLoading, setErrorMessage, renderForError, GraphQLErrorComponent} from './apollo';

const ComposeQuery = (component, propName = "data") => (compose(
	renderWhileLoading(graphQLQueryLoading, propName),
	setErrorMessage(propName),
	renderForError(GraphQLErrorComponent, propName)
)(component))

// export const MyCompose = (componet, { 	...props }) =>
// compose(...props)(componet)

export default ComposeQuery