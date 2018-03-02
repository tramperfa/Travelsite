// External Packages
import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {ApolloProvider} from 'react-apollo';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Loadable from 'react-loadable';

//Styles
import './App.css';
import {THEME} from './lib/config';

// Routes and components
import LoadingSplitCode from './lib/LoadingSplitCode';
import StoryReader from './components/StoryReader'; // -12KB if Split
import Header from './components/Header';
import Homepage from './components/Homepage';
import AuthSignupDialog from './components/AuthSignupDialog'; // -3KB if Split
import Signup from './components/Signup';
import UserPage from './components/UserPage'; // TB Split

import NotFound from './components/NotFound';
import Login from './components/Login';

//GraphQL
import client from './graphql/graphql';

//Redux
import reducer from './redux/reducers';

import PrivateRoute from './lib/PrivateRoute';

const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const LoadablePrivateUserPage = Loadable({
	loader: () => import (/* webpackChunkName: 'Editor' */
	'./components/PrivateUserPage'),
	loading: LoadingSplitCode,
	delay: 1000
})

// const LoadableStoryReader = Loadable({ 	loader: () => import (/*
// webpackChunkName: 'Reader' */ 	'./components/StoryReader'), 	loading:
// LoadingSplitCode, 	delay: 1000 })

const App = () => {
	return (
		<Provider store={store}>
			<ApolloProvider client={client}>
				<BrowserRouter>
					<MuiThemeProvider theme={createMuiTheme(THEME)}>
						<div>
							<Header/>
							<AuthSignupDialog/>
							<Switch>
								<Route exact={true} path="/" component={Homepage}/>
								<Route path='/story/:_id' component={StoryReader}/>
								<Route path="/user/:_id" component={UserPage}/>
								<PrivateRoute path="/my" component={LoadablePrivateUserPage}/>
								<Route path="/signup" component={Signup}/>
								<Route path="/login" component={Login}/>
								<Route path="/dest" component={null} key="dest"/>
								<Route path="/hotel" component={null} key="hotel"/>
								<Route component={NotFound}/>
							</Switch>
						</div>
					</MuiThemeProvider>
				</BrowserRouter>
			</ApolloProvider>
		</Provider>
	)
}

export const state = store.getState()

export default App

//	<Route path='/story/:_id' render={(props) => (<StoryReader {...props}/>)}/>