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

import AuthSignupDialogContainer from './containers/AuthSignupDialogContainer';
import HeaderContainer from './containers/HeaderContainer';
import Homepage from './routes/Homepage';
import NotFound from './routes/NotFound';
import EditPage from './routes/EditPage';
import StoryReader from './routes/StoryReader';
import UserHome from './routes/UserHome';
import UserDraft from './routes/UserDraft';
import Signup from './routes/Signup';

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
							<HeaderContainer/>
							<AuthSignupDialogContainer/>
							<Switch>
								<Route exact={true} path="/" component={Homepage}/>
								<Route path='/story/:_id' component={StoryReader}/>
								<Route path="/user/:_id" component={UserHome}/>
								<Route path="/mydraft" component={UserDraft}/>
								<Route path="/edit/:_id" component={EditPage}/>
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