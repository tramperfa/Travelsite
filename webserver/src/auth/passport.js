

/*!
 * Module dependencies.
 */

import local from './passport/local';
import google from './passport/google';
import facebook from './passport/facebook';
import passport from 'passport';

module.exports = function(app) {


  passport.serializeUser(function(user, done) {
    // Check that the user is not disabled or deleted
    if (user.status !== 1)
    done(null, false);

    var sessionUser = { _id: user._id, role: user.role }
    done(null, sessionUser)
  });

  passport.deserializeUser(function(sessionUser, done) {
    // The sessionUser object is different from the user mongoose collection
    // it's actually req.session.passport.user and comes from the session collection
    done(null, sessionUser);
  });

  // use these strategies
  passport.use(local);
  //passport.use(google);
  //passport.use(facebook);

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

};
