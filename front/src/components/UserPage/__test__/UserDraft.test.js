import React from 'react';
import renderer from 'react-test-renderer';
// Note: test renderer must be required after react-native. i
import {shallow, mount} from 'enzyme';
import {MemoryRouter, StaticRouter} from 'react-router-dom';
import toJson from 'enzyme-to-json'

import {UserDraft} from '../UserDraft';
import {MockedProvider} from 'react-apollo/test-utils';

const mockedData = {
	myDrafts: [
		{

			_id: 'test001',
			title: 'trip to test1',
			lastUpdate: 'Thu Dec 07 2017 04:49:49 GMT+0000 (UTC)',
			__typename: "Draft"
		}
	]
}

const createDraft = jest.fn()

test('Mount renders correctly, createDraft called on button click', () => {
	const wrapper = mount(
		<MockedProvider>
			<StaticRouter context={{}}>
				<UserDraft createDraft={createDraft} draftList={mockedData}/>
			</StaticRouter>
		</MockedProvider>

	);

	let section = wrapper.find('div.create')
	let createButton = section.find('Button')
	createButton.simulate('click')
	expect(createDraft).toHaveBeenCalledTimes(1);
	expect(toJson(wrapper)).toMatchSnapshot();
});
