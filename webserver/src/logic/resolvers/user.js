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
      if (context.sessionUser) {
        console.log("user already has an account and logged in!")
        return null
      }
      const user = args.input
      return User.create(user)
    },
    localLogin: async (parent, args, context) => {
      // // Prevent Logged in user keeps hiting login GraphQL mutation
      // if (context.sessionUser != null) {
      //   console.log("Error: User already logged in")
      //   return null
      // }

      const user = await willLogin(context.req, args.input.emailorusername, args.input.password)
      await creatSession(context.req, user)
      //console.log(user);
      return user
    }
  }
}



async function creatSession(req, user) {

  if (!user) {
    throw new Error('Authen error')
  } else {
    req.logIn(user, function(err) {
      if (err) {return console.log(err) }
      req.session.save(function(err) {
        if (err) {return console.log(err) }
      })
   //console.log('The new session :'+ JSON.stringify(req.session) );
    });
  }

  // if (user) {
  //   req.logIn(user, function(err) {
  //     if (err) {return console.log(err) }
  //     req.session.save(function(err) {
  //       if (err) {return console.log(err) }
  //     })
  //  //console.log('The new session :'+ JSON.stringify(req.session) );
  //   });
  //
  // }

}

const willLogin = async (req, usernameoremail, password) => {
  // To let passport-local consume
  req.body.username = usernameoremail
  req.body.password = password

   return await willAuthenWithPassport('local', req).catch(err => err)
  // //.catch(onError(req))
}



const willAuthenWithPassport = (strategy, req) => new Promise((resolve, reject) => {
  const passport = require('passport')
  passport.authenticate(strategy, (err, user, info) => {

    //console.log("INFOOO :  " + info.message);
    // Error?
    if (err) { return reject(new Error(err)) }
    return user ? resolve(user) : reject(new Error(info.message))

    // User?
    //return user ? resolve(user) : reject(new Error('Authentication failed.'))


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
