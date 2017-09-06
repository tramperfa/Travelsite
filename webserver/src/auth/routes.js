"use strict";

import passport from 'passport';





module.exports = function(app, db) {

  // Server Heath Check
  app.get('/', function (req, res) {
    //console.log(req.sessionID);
    res.send('Hi Boyang, Let\'s start coding!')
  })

  app.post('/local-login',
    passport.authenticate('local'),
    function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    })


    /**
     * Google authentication routes
     *
     * Available scopes: https://developers.google.com/+/web/api/rest/oauth#authorization-scopes
     */
    // app.get("/google", passport.authenticate("google", {
    // 	scope: "profile email"
    // 	/*scope: [
    // 		'https://www.googleapis.com/auth/plus.login',
    // 		'https://www.googleapis.com/auth/plus.profile.emails.read'
    // 	]*/
    // }));
    //
    // app.get("/google/callback", passport.authenticate("google", {
    // 	failureRedirect: "/login"
    // }), function(req, res) {
    // 	res.redirect("/");
    // });
    //
    // /**
    //  * Facebook authentication routes
    //  */
    // app.get("/facebook", passport.authenticate("facebook", {
    // 	scope: ["email", "user_location"]
    // }));
    //
    // app.get("/facebook/callback", passport.authenticate("facebook", {
    // 	failureRedirect: "/login"
    // }), function(req, res) {
    // 	res.redirect("/");
    // });

};
