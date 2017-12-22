import React from 'react';
import {branch, renderComponent, withProps} from 'recompose';

export const renderWhileLoading = (component, propName = 'data') => branch(
	props => props[propName] && props[propName].loading,
	renderComponent(component),
);

export const graphQLQueryLoading = () => {
	return (<div>Loading</div>)
}

export const setRefetchProp = (propName = "data") => withProps(props => ({
	refetch: props[propName] && props[propName].data
}))

export const renderForError = (component, propName = "data") => branch(
	props => props[propName] && props[propName].error,
	renderComponent(component),
);

export const GraphQLErrorComponent = props => (
	<span>
		Something went wrong, you can try to
		<button onClick={props.refetch}>refetch</button>
	</span>
)