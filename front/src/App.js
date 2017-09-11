import React, { Component } from 'react';
import './App.css';
import Homepage from './components/Homepage';
import NotFound from './components/NotFound';
import Editor from './components/Editor';
import StoryReader from './components/StoryReader';


import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';


// Create GraphQL client to setup Connection with GraphQL server
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  opts: {
  credentials: 'include',
  },
});

networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500);
  },
}]);



const client = new ApolloClient({
  networkInterface,
});



class App extends Component {
  render() {
    return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="App">
          <Link to="/" className="navbar">Travel Site Building Underway</Link>
          <Switch>
            <Route exact path="/" component={Homepage}/>
            <Route path="/editor" component={Editor}/>
            <Route path="/story/:_id" component={StoryReader}/>
            <Route component={ NotFound }/>
          </Switch>
        </div>
      </BrowserRouter>
    </ApolloProvider>
    );
  }
}

export default App;
