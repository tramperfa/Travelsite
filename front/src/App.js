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
import Loading from './components/Loading';
// import StoryEditor from './components/StoryEditor';
import StoryReader from './components/StoryReader'; // -12KB if Split
import Header from './components/Header';
import Homepage from './components/Homepage';
import AuthSignupDialog from './components/AuthSignupDialog'; // -3KB if Split
import Signup from './components/Signup';
import UserPage from './components/UserPage'; // TB Split
import UserDraft from './components/UserPage/UserDraft';

//TBD
import NotFound from './components/NotFound';

//GraphQL
import client from './graphql/graphql';

//Redux
import reducer from './redux/reducers';
const store = createStore(
	reducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const LoadableStoryEditor = Loadable({
	loader: () => import (/* webpackChunkName: 'Editor' */
	'./components/StoryEditor'),
	loading: Loading,
	delay: 1000
})

// const LoadableStoryReader = Loadable({ 	loader: () => import (/*
// webpackChunkName: 'Reader' */ 	'./components/StoryReader'), 	loading:
// Loading, 	delay: 1000 })

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
								<Route path="/mydraft" component={UserDraft}/>
								<Route path="/edit/:_id" component={LoadableStoryEditor}/>
								<Route path="/signup" component={Signup}/>
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

export default App

//	<Route path='/story/:_id' render={(props) => (<StoryReader {...props}/>)}/>