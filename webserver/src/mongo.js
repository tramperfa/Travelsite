"use strict";

//let logger 			= require("./logger");
let config 			= require("./config");

//let chalk 			= require("chalk");
//let mongoose 		= require("mongoose");
//let autoIncrement 	= require("mongoose-auto-increment");

import mongoose from 'mongoose';

module.exports = function() {
	let db;
	mongoose.Promise = global.Promise;

	if (mongoose.connection.readyState !== 1) {
		console.log("Connecting to Mongo " + config.db.uri + "...");
		db = mongoose.connect(config.db.uri, config.db.options, function mongoAfterConnect(err) {
			if (err) {
				console.log("Could not connect to MongoDB!");
				return;
			}
			//mongoose.set("debug", config.isDevMode());
		});


	} else {
		// logger.info("Mongo already connected.");
		console.log("Mongo already connected.");
		db = mongoose;
	}
	return db;
};
