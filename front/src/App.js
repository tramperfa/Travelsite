// External Packages
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {ApolloProvider} from 'react-apollo';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

//Styles
import './App.css';

// Routes
import Homepage from './routes/Homepage';
import NotFound from './routes/NotFound';
import EditPage from './routes/EditPage';
import StoryReader from './routes/StoryReader';
import UserHome from './routes/UserHome';
import UserDraft from './routes/UserDraft';
import Signup from './routes/Signup';

//Library
import persist from './lib/persist';
import {THEME} from './lib/config';

//GraphQL
import client from './graphql/graphql';

//Redux
import reducer from './redux/reducers';

// UI components
import Login from './components/Authentication/Login';
import NavBar from './components/Navigation/NavBar';

const store = createStore(reducer)

class App extends Component {

	state = {
		me: {
			looading: true
		},
		//openLogin: false
	}

	componentDidMount() {
		persist.willGetSessionUser().then(function (value) {
			if (value) {
				this.setState({me: value})
			} else {
				this.setState({
					me: {
						looading: false
					}
				})
			}
		}.bind(this))
	}

	onLogin = (me) => {
		this.setState({me: me})
	}

	onLogout = () => {
		this.setState({me: {}})
	}

	theme(outerTheme) {
		return createMuiTheme(THEME);
	}

	render() {

		return (
			<Provider store={store}>
				<ApolloProvider client={client}>
					<BrowserRouter>
						<MuiThemeProvider theme={this.theme}>
							<div>
								<NavBar me={this.state.me} onLogout={this.onLogout}/>
								<Login onLogin={this.onLogin}/>
								<Switch>
									<Route exact={true} path="/" component={Homepage}/>
									<Route
										path='/story/:_id'
										render={(props) => (<StoryReader {...props} me={this.state.me}/>)}/>
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
		);
	}
}

export default App;
