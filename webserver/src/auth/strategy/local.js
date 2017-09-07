'use strict';
/**
 * Module dependencies.
 */

import User from '../../logic/models/user'
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;


/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback : true
  }, function(req, username, password, done) {
		return User.findOne({
			$or: [
				{ "username": username},
				{ "email": username}
			]
		}, function(err, user) {
			if (err)
				 done(err);

			if (!user)
				 done(null, false, {
					message: console.log("UnknowUsernameOrEmail")
				});

			// if (!user.verified)
			// 	 done(null, false, {
			// 		message: console.log("PleaseActivateAccount")
			// 	});

			// Check that the user is not disabled or deleted
			if (user.status !== 1)
				 done(null, false, {
					message: console.log("UserDisabledOrDeleted")
				});

			if (user.passwordLess)
				 done(null, false, {
					message: console.log("PasswordlessAccountLeaveEmpty")
				});

			user.comparePassword(password, function(err, isMatch) {
				if (err)
					 done(err);

				if (isMatch !== true)
					 done(null, false, {
						message: console.log("InvalidPassword")
					});

				else
          //console.log("successful login");
				done(null, user)



			});
		});
	});
