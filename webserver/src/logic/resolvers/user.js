import User from '../models/user';
import passport from 'passport';



module.exports = {
  Query: {
    user: (root, { _id }) => {
        return models.User.findOne({
          where: {
            id: user.id,
          },
        });
    }
  },
  Mutation: {
    registerUser: (parent, args, context) => {
      // TODO check faliled login context.passport value
      if (context.passport && context.passport.sessionUser) {
        console.log("user already has an account and logged in!")
        return null
      }
      const user = args.input
      return User.create(user)
    },
    localLogin: (parent, args, context) => {
      //console.log(args);
      const user = willLogin(context.req, args.input.emailorusername, args.input.password).catch(err => err)
      //.catch(onError(context))
    }
  }
}


const willLogin = async (req, username, password) => {
  // To let passport-local consume
  req.body.username = username
  req.body.password = password

  // return await willAuthenWithPassport('local', req).catch(err => err)
  // //.catch(onError(req))
  passport.authenticate('local',
  function (err, user) {
    // req.logIn(user, function (err) { // <-- Log user in
    // });

    //console.log("user:  " + user)
    console.log("req.session.passport:  " + req.session.passport)
    req.logIn(user, function(err) {
      if (err) { return next(err); }

       //var  = req.session; // {user: 1}
       console.log("req.session:   " + JSON.stringify(req.session));
       //console.log("session.passport: " + session.passport);
      // req.session.regenerate(function(err){
      //     //req.session.passport is now undefined
      //     req.session.passport = temp;
      //     req.session.save(function(err){
      //
      //     });
      // });


    });
  })(req);
}

var session = function (req, res) {
    var temp = req.session.passport; // {user: 1}
    req.session.regenerate(function(err){
        //req.session.passport is now undefined
        req.session.passport = temp;
        req.session.save(function(err){

        });
    });
};



const willAuthenWithPassport = (strategy, req) => new Promise((resolve, reject) => {
  const passport = require('passport')
  passport.authenticate(strategy, (err, user) => {
    // Error?
    if (err) { return reject(err) }

    // User?
    return user ? resolve(user) : reject(new Error('Authentication failed.'))
  })(req)

})



/////////////////////////////////////////  ERROR HANDLING ///////////////////////////////////////////////////////////
//
// class GenericError extends Error {
//   constructor(code, message) {
//     super(message)
//     this.code = code
//   }
// }
//
// const _COMMON_ERRORS = {
//   403: 'Forbidden',
//   501: 'Server error',
// }
//
// const _push = (req, { code, message }) => req.errors.push({ code, message })
//
// const onError = (req) => (...args) => {
//   // Error('foo')
//   if (args[0] instanceof Error) {
//     _push(req, new GenericError(0, args[0].message))
//     return null
//   }
//
//   // 'foo'
//   if (typeof args[0] === 'string') {
//     _push(req, new GenericError(0, args[0]))
//     return null
//   }
//
//   // 403, 'foo'
//   if (typeof args[0] === 'number' && typeof args[1] === 'string') {
//     _push(req, new GenericError(args[0], args[1]))
//     return null
//   }
//
//   // 403
//   if (typeof args[0] === 'number' && args.length === 1) {
//     _push(req, new GenericError(args[0], _COMMON_ERRORS[args[0]] || ''))
//     return null
//   }
//
//   return null
// }
