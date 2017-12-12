import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

test('renders without crashing', (done) => {
	if (document) {
		const div = document.createElement('div');
		ReactDOM.render(<App/>, div);
	} else {
		ReactDOM.render(<App/>);
	}

	setTimeout(() => done(), 1000);

});
