'use strict';
/**
 * Module dependencies.
 */

import User from '../../models/user.js'
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
				return done(err);

			if (!user)
				return done(null, false, {
					message: req.t("UnknowUsernameOrEmail")
				});

			if (!user.verified)
				return done(null, false, {
					message: req.t("PleaseActivateAccount")
				});

			// Check that the user is not disabled or deleted
			if (user.status !== 1)
				return done(null, false, {
					message: req.t("UserDisabledOrDeleted")
				});

			if (user.passwordLess)
				return done(null, false, {
					message: req.t("PasswordlessAccountLeaveEmpty")
				});

			user.comparePassword(password, function(err, isMatch) {
				if (err)
					return done(err);

				if (isMatch !== true)
					return done(null, false, {
						message: req.t("InvalidPassword")
					});

				else
					return done(null, user);

			});
		});
	});