import React from 'react';
// Note: test renderer must be required after react-native. import renderer from
// 'react-test-renderer';
import {TheUserDraft} from '../UserDraft';
import {shallow} from 'enzyme';

test('renders correctly', () => {
	const mockedData = {
		data: {
			createDraft: {
				_id: 'test000'
			}
		}
	}

	const wrapper = shallow(
		<TheUserDraft createDraft={() => {
				return mockedData
			}}/>,
	);
	expect(wrapper).toMatchSnapshot();
	// const myButton = wrapper.find('withStyles(Button)'); console.log(myButton);
	// wrapper.find('button').simulate('click');

});
