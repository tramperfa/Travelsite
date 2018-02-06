'use strict';
/**
 * Module dependencies.
 */

import User from '../../logic/models/user'
import passport from 'passport'
const LocalStrategy = require('passport-local').Strategy

/**
 * Expose
 */

module.exports = new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
}, function (req, email, password, done) {
	return User.findOne({
		"email": email
	}, function (err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
			return done(null, false, {message: "User email does not match password"});
		}

		// if (!user.verified) {  return done(null, false, { message:
		// "PleaseActivateAccount" }); } Check that the user is not disabled or deleted
		if (user.status !== 1) {
			return done(null, false, {message: "User has been banned"});
		}

		user.comparePassword(password, function (err, isMatch) {
			if (err) {
				return done(err);
			}

			if (isMatch !== true) {
				return done(null, false, {message: "User email does not match password"});
			}

			return done(null, user);
			//return done(null, user, { message: "successful login via local strategy" });

		});

	});
});
