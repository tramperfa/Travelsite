// External Packages
import React, {Component} from 'react';
// import {ApolloProvider, createNetworkInterface} from 'react-apollo'; import
// ApolloClient from 'apollo-client';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {InMemoryCache} from 'apollo-cache-inmemory';
//import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';

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

// UI components
import Login from './components/Authentication/Login';
import NavBar from './components/Navigation/NavBar';

// Create GraphQL client to setup Connection with GraphQL server const
// networkInterface = createNetworkInterface({   uri:
// 'http://localhost:8080/graphql',   opts: {     credentials: 'include'   } });
//
// networkInterface.use([   {     applyMiddleware(req, next) { setTimeout(next,
// 500);     }   } ]);
//
// const client = new ApolloClient({networkInterface});  NEW SETTING
const link = createHttpLink(
  {uri: 'http://localhost:8080/graphql', credentials: 'include'}
)

const cache = new InMemoryCache({
  // dataIdFromObject: () =>  custom idGetter,
  addTypename: true,
  // cacheResolvers: {}, fragmentMatcher: new IntrospectionFragmentMatcher({
  // introspectionQueryResultData: yourData }),
});

const client = new ApolloClient({
  link,
  // use restore on the cache instead of initialState
  cache: cache.restore(window.__APOLLO_CLIENT__),
  ssrMode: true,
  ssrForceFetchDelay: 100,
  connectToDevTools: true,
  queryDeduplication: true
});

////////////////////////////////////

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
