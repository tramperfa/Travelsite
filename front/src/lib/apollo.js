import React from 'react';
import {branch, renderComponent, withProps} from 'recompose';

export const renderWhileLoading = (component, propName = 'data') => branch(
	props => props[propName] && props[propName].loading,
	renderComponent(component),
);

export const graphQLQueryLoading = () => {
	return (<div>Loading</div>)
}

export const setErrorMessage = (propName = "data") => withProps(props => {
	if (props[propName] && props[propName].error && props[propName].error.graphQLErrors[0]) {
		return ({errorInfo: props[propName].error.graphQLErrors[0].message})
	}
})

export const renderForError = (component, propName = "data") => branch(
	props => props[propName] && props[propName].error,
	renderComponent(component),
);

export const GraphQLErrorComponent = props => (
	<span>
		Something went wrong
{/* <div>
			{props.errorInfo}
		</div> */
}
	</span>
)
