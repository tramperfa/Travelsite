import React, {Component} from 'react';
import './App.css';
import Homepage from './components/Homepage';
import {ApolloProvider, createNetworkInterface} from 'react-apollo';
import ApolloClient from 'apollo-client';
import {
  BrowserRouter,
  //Link,
  Route,
  Switch
} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
// import {createBrowserHistory} from 'history';

import NotFound from './components/NotFound';
import EditPage from './components/EditPage';
import StoryReader from './components/StoryReader';
import Login from './components/Login';
import Header from './components/Header';
import UserHome from './components/UserHome';
import UserDraft from './components/UserDraft';
import persist from './lib/persist';

// Create GraphQL client to setup Connection with GraphQL server
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  opts: {
    credentials: 'include'
  }
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500);
    }
  }
]);

const client = new ApolloClient({networkInterface});
// const history = createBrowserHistory()

class App extends Component {

  state = {
    me: {},
    openLogin: false,
    //redirect: false
  }

  componentDidMount() {
    persist.willGetSessionUser().then(function(value) {
      if (value) {
        this.setState({me: value})
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

  //Overwrite Material-UI Theme
  theme(outerTheme) {
    return createMuiTheme({
      typography: {
        fontFamily: '"SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif',
        body1: {
          fontWeight: 'normal'
        },
        button: {
          fontFamily: '"SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif',
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
              <Header client={client} me={this.state.me} onLogout={this.onLogout} handleClickOpen={this.handleClickOpen}/>
              <Login client={client} onLogin={this.onLogin} openLogin={this.state.openLogin} handleRequestClose={this.handleRequestClose}/>
              <Switch>
                <Route exact path="/" component={Homepage}/>
                <Route path='/story/:_id' render={(props) => (<StoryReader {...props} handleTriggerOpen={this.handleTriggerOpen} me={this.state.me}/>)}/>
                <Route path="/user/:_id" component={UserHome}/>
                <Route path="/userdraft/:_id" component={UserDraft}/>
                <Route path="/edit/:_id" component={EditPage}/>
                <Route path="/signup" component={null} key="signup"/>
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
