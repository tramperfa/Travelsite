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
			if (err) {
        return done(err);
      }

			if (!user) {
        return done(null, false, { message: "UnknowUsernameOrEmail" });
      }


			// if (!user.verified) {
      //  return done(null, false, { message: "PleaseActivateAccount" });
      //}


			// Check that the user is not disabled or deleted
			if (user.status !== 1) {
        return done(null, false, { message: "UserDisabledOrDeleted" });
      }
				 
			user.comparePassword(password, function(err, isMatch) {
				if (err) {
          return done(err);
        }

				if (isMatch !== true) {
          return done(null, false, { message: "InvalidPassword" });
        }

        return done(null, user);
        //return done(null, user, { message: "successful login via local strategy" });

			});

		});
	});
