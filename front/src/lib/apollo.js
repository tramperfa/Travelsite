import React from 'react';
import {branch, renderComponent, withProps} from 'recompose';
import QueryErrorComp from './QueryErrorComp';

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

export const GraphQLErrorComponent = (props) => {
	return (<QueryErrorComp errorInfo={props.errorInfo}/>)
}

// export class GraphQLQueryErrorComponent extends React.Component {
// constructor(props) { 		super(props); 		this.state = { 			error: {
// errorMessage: props.errorInfo, 				flag: false 			} 		} 	}
//
// 	render() { 		return (<QueryErrorComp error={this.state.error}/>) 	} }