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
    registerUser: async (parent, args, context) => {
      // if (context.sessionUser) {
      //   console.log("user already has an account and logged in!")
      //   return null
      // }
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
      await willCreateSession(context.req, user)
      console.log("telling user login complete");
      return user
    }
  }
}



const willCreateSession = (req, user) => new Promise ((resolve, reject) => {
  if (user) {
    req.logIn(user, function(err) {
      if (err) { return reject(new Error(err)) }
      req.session.save(function(err) {
        if (err) { return reject(new Error(err)) }
        console.log('Finish session create');
        return resolve("session create successful")
      })
    });
  }
})




const willLogin = async (req, usernameoremail, password) => {
  // To let passport-local consume
  req.body.username = usernameoremail
  req.body.password = password

   return await willAuthenWithPassport('local', req).catch(err => err)
  // //.catch(onError(req))
}



const willAuthenWithPassport = (strategy, req) => new Promise((resolve, reject) => {

  passport.authenticate(strategy, (err, user, info) => {

    // Error?
    if (err) { return reject(new Error(err)) }
    return user ? resolve(user) : reject(new Error(info.message))

    // User?
    //return user ? resolve(user) : reject(new Error('Authentication failed.'))

  })(req)

})
