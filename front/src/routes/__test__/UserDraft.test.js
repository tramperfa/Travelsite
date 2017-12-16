import React from 'react';
import renderer from 'react-test-renderer';
// Note: test renderer must be required after react-native. i
import {shallow, mount} from 'enzyme';
import {MemoryRouter, StaticRouter} from 'react-router-dom';
import toJson from 'enzyme-to-json'

import {UserDraft} from '../UserDraft';
import {MockedProvider} from 'react-apollo/test-utils';

const mockedData = {
	data: {
		createDraft: {
			_id: 'test000',
			title: 'trip to test0',
			lastUpdate: 'Thu Dec 07 2017 04:49:49 GMT+0000 (UTC)'
		}
	}
}
// test('renders correctly', () => { const wrapper = shallow( 		<UserDraft
// createDraft={() => { 				return mockedData 			}}/>, 	);
// expect(wrapper).toMatchSnapshot();   const myButton
// = wrapper.find('withStyles(Button)'); console.log(myButton);
// wrapper.find('button').simulate('click');
//
// });

test('Mount renders correctly', () => {
	const wrapper = mount(
		<MockedProvider>
			<StaticRouter context={{}}>
				<UserDraft createDraft={() => {
						return mockedData
					}}/>
			</StaticRouter>
		</MockedProvider>

	);

	//console.log(JSON.stringify(wrapper));

	wrapper.find('button').forEach(child => {
		console.log("SIMULATED");
		child.simulate('click');
	});
	//expect(handleDelete.calledOnce).toBe(true);
	expect(toJson(wrapper)).toMatchSnapshot();
});
