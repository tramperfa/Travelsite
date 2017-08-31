import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
const mongoStore = require('connect-mongo')(session);
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';

import { schema } from './schema';

let db          = require('./mongo.js')();
let config 			= require('./config');


const app = express();

/**
 * Initialize middlewares
 */
 app.use(cors({
   origin: 'http://localhost:3000',
   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   credentials: true
 }));

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
 		extended: true,
 		limit: config.contentMaxLength * 2
 	}));

 app.use(cookieParser(config.sessions.secret));



 /**
  * Initialize session with MongoDB session store
  */
var sessionStore = new mongoStore({
  url: config.sessions.uri,
  collection: config.sessions.collection,
  autoReconnect: true
});

var sessionOpts = {
  saveUninitialized: true,
  resave: false,
  secret: config.sessions.secret,
  store: sessionStore,
  cookie: config.sessions.cookie,
  name: config.sessions.name
}

app.use(session(sessionOpts));


/**
 * Initialize authentication
 * @param {any} app
 */
require('./auth/passport')(app);


/**
 * Load Routes
 * @param {any} app
 */

// To be replaced with routes loading

app.get('/', function (req, res) {
  res.send('Hello Boyang!')
})

app.use("/graphql", graphqlExpress( (req) => {
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error("Query too large.");
  }
  // logger.debug("GraphQL request:", query);

  return {
    schema: schema,
    context: { session: req.session.passport },
    formatError(e) {
      return {
        status: e.originalError ? e.originalError.status : 400,
        type: e.originalError ? e.originalError.type : null,
        message: e.message,
        locations: e.locations,
        path: e.path
      };
    }
  };

}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));



/**
 * Start Server
 */
app.listen(config.PORT, () => {
  console.log(`GraphQL app is now running on http://localhost:${config.PORT}`)
  console.log(`GraphiQL UI is now up on http://localhost:${config.PORT}/graphiql`)
});
