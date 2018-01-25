// External Packages
import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {ApolloProvider} from 'react-apollo';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

//Styles
import './App.css';
import {THEME} from './lib/config';

// Routes and components
import StoryEditor from './components/StoryEditor';
import StoryReader from './components/StoryReader';
import Header from './components/Header';
import Homepage from './components/Homepage';
import AuthSignupDialog from './components/AuthSignupDialog';
import Signup from './components/Signup';
import UserPage from './components/UserPage';
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
								<Route path="/edit/:_id" component={StoryEditor}/>
								<Route path="/signup" component={Signup} key="signup"/>
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