'use strict';

/**
 * Expose
 */

module.exports = {
  db: 'mongodb://localhost/noobjs_dev',
  facebook: {
    clientID: 878347075597764,
    clientSecret: "c39b5c6522f6c0fb88b32ef3ceedf472",
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  google: {
    clientID: 248109223728,
    clientSecret: "FMx5q1viFr6kNa3O0qDMwZrk",
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }
};
