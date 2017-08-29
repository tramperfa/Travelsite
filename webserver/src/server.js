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

let db          = require('./mongo.js')();
let config 			= require('./config');
let schema      = require('./schema');

const app = express();


/**
 * Initialize middlewares
 */
 app.use(cors({
   origin: 'http://localhost:3000',
   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   credentials: true
 }));

 app.use(bodyParser.urlencoded({
 		extended: true,
 		limit: config.contentMaxLength * 2
 	}));

 app.use(bodyParser.json());
 app.use(cookieParser());
 app.use(cookieSession({ secret: 'ufoufo' }));


 /**
  * Initialize session (mongo-store)
  */
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.sessions.secret,
  store: new mongoStore({
    url: 'mongodb://mongodb:27017/my_database',
    collection: config.sessions.collection,
    autoReconnect: true
  }),
  cookie: config.sessions.cookie,
  name: config.sessions.name
}));


/**
 * Initialize authentication
 * @param {any} app
 */
require('./auth/passport')(app);


// To be replaced with routes loading
app.get('/', function (req, res) {
  res.send('Hello Boyang!')
})

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
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
