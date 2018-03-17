import express from "express"
import session from "express-session"
import cookieParser from "cookie-parser"
//import cookieSession from "cookie-session"
import bodyParser from "body-parser"
import cors from "cors"
//import passport from "passport" import mongoose from "mongoose"
const mongoStore = require("connect-mongo")(session)

let db = require("./lib/mongo.js")()
let config = require("./lib/config")

const app = express()

/**
 * Initialize middlewares
 */
app.use(cors({
	origin: "http://localhost:3000", optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	credentials: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true,
	limit: config.contentMaxLength * 2
}))

app.use(cookieParser(config.sessions.secret))

/**
  * Initialize session with MongoDB session store
  */
var sessionStore = new mongoStore(
	{url: config.sessions.uri, collection: config.sessions.collection, autoReconnect: true}
)

var sessionOpts = {
	saveUninitialized: true,
	resave: false,
	secret: config.sessions.secret,
	store: sessionStore,
	cookie: config.sessions.cookie,
	name: config.sessions.name
}

app.use(session(sessionOpts))

// Add message way from DB to frontend app.use(flash());

/**
 * Initialize authentication
 */
require("./auth/passport")(app)
require("./auth/routes")(app, db)

/**
 * Setup Image Upload
 */
require("./lib/upload")(app, db)

/**
 * Setup GraphQL
 */

require("./logic/graphql")(app, db)

/**
 * Start Server
 */
app.listen(config.PORT, () => {
	console.log(`GraphQL app is now running on http://localhost:${config.PORT}`)
	console.log(
		`GraphiQL UI is now up on http://localhost:${config.PORT}/graphiql`
	)
})
