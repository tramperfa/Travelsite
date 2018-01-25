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
