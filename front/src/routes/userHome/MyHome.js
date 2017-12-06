import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';
//import Button from 'material-ui/Button';

//
import {userDetailQuery} from '../../graphql/user';
import {myStoryQuery} from '../../graphql/story';

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

export const withUserData = graphql(userDetailQuery, {
	options: (props) => ({
		variables: {
			_id: props.match.params._id
		}
	}),
	name: 'userData'
})

export const withMyStoryData = graphql(myStoryQuery, {
	options: {
		fetchPolicy: 'network-only'
	},
	name: 'myStoryData'
})

export default withMyStoryData(withUserData(MyHome))

// if (error) {   return <p>{error.graphQLErrors[0].message}</p>; }