import React from 'react';
import renderer from 'react-test-renderer';
// Note: test renderer must be required after react-native. i
import {shallow, mount} from 'enzyme';
import {MemoryRouter, StaticRouter} from 'react-router-dom';
import toJson from 'enzyme-to-json'
import {MockedProvider} from 'react-apollo/test-utils';

import {DraftCard} from '../DraftCard';
import TheDraftCard from '../DraftCard';

// test('shallow renders correctly', () => { 	const wrapper = shallow(
// <MemoryRouter> <TheDraftCard deleteDraft={() => {}} draft={{}} classes={{}}/>
// </MemoryRouter>
//
// ); 	const render = wrapper.dive() 	console.log(JSON.stringify(render));
// render.find('IconButton').forEach(child => { 		console.log("SIMULATED");
// child.simulate('click'); 	}); 	expect(wrapper).toMatchSnapshot(); });

test('Tree renders correctly', () => {
	const tree = renderer.create(
		<StaticRouter context={{}}>
			<DraftCard
				deleteDraft={() => {}}
				draft={{
					_id: 'test000'
				}}
				classes={{}}/>
		</StaticRouter>
	).toJSON();
	expect(tree).toMatchSnapshot();
});

test('Mount renders correctly', () => {
	const wrapper = mount(
		<StaticRouter context={{}}>
			<DraftCard
				deleteDraft={() => {}}
				draft={{
					_id: 'test000',
					title: 'trip to test0',
					lastUpdate: 'Thu Dec 07 2017 04:49:49 GMT+0000 (UTC)'

				}}
				classes={{}}/>
		</StaticRouter>
	);

	wrapper.find('button').forEach(child => {
		//console.log("SIMULATED");
		child.simulate('click');
	});
	//expect(handleDelete.calledOnce).toBe(true);
	expect(toJson(wrapper)).toMatchSnapshot();
});
