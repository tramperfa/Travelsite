import React from 'react';

const Loading = (props) => {

	if (props.error) {
		//TODO LOG and FallBack
		console.log(props.error);
		return <div>Error!</div>;
	} else if (props.pastDelay) {
		return <div>Loading GO!!!!!!!</div>;
	} else {
		return null;
	}
}

export default Loading
