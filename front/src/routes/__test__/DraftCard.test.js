import React from 'react';
// Note: test renderer must be required after react-native. import renderer from
// 'react-test-renderer';
import {DraftCard} from '../../components/DraftCard';
import {shallow} from 'enzyme';

test('renders correctly', () => {

	const wrapper = shallow(
		<DraftCard deleteDraft={() => {}} draft={{}} classes={{}}/>,

	);
	expect(wrapper).toMatchSnapshot();
	// const myButton = wrapper.find('withStyles(Button)'); console.log(myButton);
	// wrapper.find('button').simulate('click');

});
