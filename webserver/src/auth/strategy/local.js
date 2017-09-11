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
				 return done(err);

			if (!user)
				 return done(null, false, {
					message: console.log("UnknowUsernameOrEmail")
				});

			// if (!user.verified)
			// 	 done(null, false, {
			// 		message: console.log("PleaseActivateAccount")
			// 	});

			// Check that the user is not disabled or deleted
			if (user.status !== 1)
				 return done(null, false, {
					message: console.log("UserDisabledOrDeleted")
				});

			user.comparePassword(password, function(err, isMatch) {
				if (err)
					 return done(err);

				if (isMatch !== true)
					 return done(null, false, {
						message: console.log("InvalidPassword")
					});

        console.log("successful login user");
        //console.log(user);
        return done(null, user)



			});
		});
	});
