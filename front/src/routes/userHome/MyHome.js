import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
//import Button from 'material-ui/Button';

//
import {USER_DETAIL_QUERY} from '../../graphql/user';
import {MY_STORY_QUERY} from '../../graphql/story';

class MyHome extends React.Component {

	render() {
		const user = this.props.userData.user
		if (this.props.userData.loading) {
			return (<div>Loading</div>)
		}

		return (
			<div>
				<div>
					<div>{"FullName: " + user.fullName}</div>
					<div>{"Username: " + user.username}</div>
					<div>{user._id}</div>
					<div>{user.provider}</div>
				</div>
			</div>
		)

	}

}

MyHome.propTypes = {
	match: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
	myStoryData: PropTypes.object.isRequired
}

export const withUserData = graphql(USER_DETAIL_QUERY, {
	options: (props) => ({
		variables: {
			_id: props.match.params._id
		}
	}),
	name: 'userData'
})

export const withMyStoryData = graphql(MY_STORY_QUERY, {
	options: {
		fetchPolicy: 'network-only'
	},
	name: 'myStoryData'
})

export default withMyStoryData(withUserData(MyHome))

// if (error) {   return <p>{error.graphQLErrors[0].message}</p>; }