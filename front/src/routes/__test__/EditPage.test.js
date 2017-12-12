import React from 'react';
import ReactDOM from 'react-dom';
import EditPage from '../EditPage';
import renderer from 'react-test-renderer';

const origLocation = document.location.href;
let location = origLocation;

beforeAll(() => {
	const parser = document.createElement('a');
	[
		'href',
		'protocol',
		'host',
		'hostname',
		'origin',
		'port',
		'pathname',
		'search',
		'hash'
	].forEach(prop => {
		Object.defineProperty(window.location, prop, {
			get: function () {
				parser.href = location;
				return parser[prop];
			}
		});
	});
});

afterEach(() => {
	location = origLocation;
});

test('location 1', () => {
	location = "https://www.google.com/";
	console.log(document.location.href);
});

test('location 2', () => {
	console.log(document.location.href);
});
