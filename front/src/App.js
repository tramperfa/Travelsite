import React, {Component} from 'react';
import './App.css';
import Homepage from './components/Homepage';
import NotFound from './components/NotFound';
import Editor from './components/Editor';
import StoryReader from './components/StoryReader';
import Login from './components/Login';
import Header from './components/Header';

import {ApolloClient, ApolloProvider, createNetworkInterface} from 'react-apollo';

import {
  BrowserRouter,
  //Link,
  Route,
  Switch
} from 'react-router-dom';

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

class App extends Component {

  state = {
    me: {},
    openLogin: false
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

  handleRequestClose = () => {
    this.setState({openLogin: false});
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <Header me={this.state.me} onLogout={this.onLogout} handleClickOpen={this.handleClickOpen}/>
            <Login onLogin={this.onLogin} openLogin={this.state.openLogin} handleRequestClose={this.handleRequestClose}/>
            <Switch>
              <Route exact path="/" component={Homepage}/>
              <Route path="/editor" component={Editor}/>
              <Route path="/story/:_id" component={StoryReader}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
