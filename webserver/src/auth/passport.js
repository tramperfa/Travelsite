

/*!
 * Module dependencies.
 */

import mongoose from 'mongoose';
import User from '../models/user.js';
import local from './passport/local';
import google from './passport/google';
import facebook from './passport/facebook';
import passport from 'passport';

module.exports = function(app) {
  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, "-password", function(err, user) {
    if (err)
      return done(err);

    // Check that the user is not disabled or deleted
    if (user.status !== 1)
      return done(null, false);

    return done(null, user);
    });
  });

  // use these strategies
  passport.use(local);
  //passport.use(google);
  //passport.use(facebook);

};
