// External Packages
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {ApolloProvider} from 'react-apollo';

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

//GraphQL
import client from './graphql/graphql';

// UI components
import Login from './components/Authentication/Login';
import NavBar from './components/Navigation/NavBar';

class App extends Component {

	state = {
		me: {
			looading: true
		},
		openLogin: false
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

	handleClickOpen = () => {
		this.setState({openLogin: true});
	}

	handleTriggerOpen = () => {
		persist.willRomveSessionUser().then(() => {
			this.setState({openLogin: true, me: {}});
		})
	}

	handleRequestClose = () => {
		this.setState({openLogin: false});
	}

	handleResetStore = () => {
		client.resetStore()
	}

	//Overwrite Material-UI Theme
	theme(outerTheme) {
		return createMuiTheme({
			typography: {
				fontFamily: '"SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Helvetica Neue", Helvetica, ' +
						'Arial, sans-serif',
				body1: {
					fontWeight: 'normal'
				},
				button: {
					fontFamily: '"SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Helvetica Neue", Helvetica, ' +
							'Arial, sans-serif',
					textTransform: 'none',
					fontWeight: 300,
					labelColor: '#f9f9f9'
				}
			}
		});
	}

	render() {

		return (
			<ApolloProvider client={client}>
				<BrowserRouter>
					<MuiThemeProvider theme={this.theme}>
						<div>
							<NavBar
								handleResetStore={this.handleResetStore}
								me={this.state.me}
								onLogout={this.onLogout}
								handleClickOpen={this.handleClickOpen}/>
							<Login
								handleResetStore={this.handleResetStore}
								onLogin={this.onLogin}
								openLogin={this.state.openLogin}
								handleRequestClose={this.handleRequestClose}/>
							<Switch>
								<Route exact={true} path="/" component={Homepage}/>
								<Route
									path='/story/:_id'
									render={(props) => (
										<StoryReader
											{...props}
											handleTriggerOpen={this.handleTriggerOpen}
											me={this.state.me}/>
									)}/>
								<Route path="/user/:_id" component={UserHome}/>
								<Route path="/userdraft/:_id" component={UserDraft}/>
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
		);
	}
}

export default App;
