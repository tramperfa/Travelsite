import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			errorInfo: undefined
		};
	}

	componentDidCatch(error, info) {
		console.log("CAUGHT ERORRRRRRR");
		// Display fallback UI
		this.setState({hasError: true, errorInfo: error.errorInfo});
		// You can also log the error to an error reporting service
		// logErrorToMyService(error, info);
		console.log(error);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong. TBD ADD ErrorComp</h1>;
		}
		return this.props.children;
	}
}

export default ErrorBoundary
