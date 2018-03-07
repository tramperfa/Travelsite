import React from 'react';
import {Route, Redirect} from "react-router-dom";
import {connect} from 'react-redux';

const PrivateRoute = ({
	component: Component,
	userLocalStoreState,
	...rest
}) => {
	// console.log("AAAA"); console.log(userLocalStoreState); console.log("BBB");
	return (!userLocalStoreState.loading && (
		<Route
			{...rest}
			render={props => (userLocalStoreState.me && userLocalStoreState.me.fullName)
				? (<Component {...props}/>)
				: (
					<Redirect
						push={true}
						to={{
							pathname: "/login",
							state: {
								from: props.location
							}
						}}/>
				)}/>
	))
}

const mapStateToProps = (state) => (
	{userLocalStoreState: state.userLocalStore}
)

export default connect(mapStateToProps, null)(PrivateRoute)
