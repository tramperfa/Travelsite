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
      // Prevent Logged in user keeps hiting login GraphQL mutation
      if (context.sessionUser != null) {
        console.log("Error: User already logged in")
        return
      }
      const user = mylocal(context.req, args.input.emailorusername, args.input.password)
      //.catch(onError(context))
    }
  }
}

function mylocal(req, usernameoremail, password) {

  // To let passport-local consume
  req.body.username = usernameoremail
  req.body.password = password

  passport.authenticate('local',
  function (err, user) {
    if (err) {
      return console.log(err)
    }
    if (!user) {
      console.log("local authenticate failed")
    } else {
      req.logIn(user, function(err) {
        if (err) { console.log(err) }
        //console.log('The new session :'+ JSON.stringify(req.session) );
        req.session.save(function(err){
        });
        return user
      });
    }
  })(req);
}


// const willLogin = async (req, usernameoremail, password) => {
//   // To let passport-local consume
//   req.body.username = usernameoremail
//   req.body.password = password
//
//    return await willAuthenWithPassport('local', req).catch(err => err)
//   // //.catch(onError(req))
// }
//
//
//
// const willAuthenWithPassport = (strategy, req) => new Promise((resolve, reject) => {
//   const passport = require('passport')
//   passport.authenticate(strategy, (err, user) => {
//     // Error?
//     if (err) { return reject(err) }
//
//     // User?
//     return user ? resolve(user) : reject(new Error('Authentication failed.'))
//   })(req)
//
// })



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
