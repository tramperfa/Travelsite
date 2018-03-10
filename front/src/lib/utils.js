import React from 'react';

export const ItemCount = ({number, singular, plural}) => {
	if (number === 0) {
		return (<div>
			No {singular + ' '}
			Found
		</div>)
	} else if (number === 1) {
		return (<div>
			Total 1 {singular}
		</div>)
	} else {
		return (<div>
			Total {number + '  ' + plural}
		</div>)
	}
}

export const error = {
	errorMessage: '',
	flag: true
}

export function onError(err) {
	return function handleError(state) {
		return {
			error: {
				errorMessage: err.graphQLErrors[0].message,
				flag: !state.error.flag
			}
		}
	}
}
