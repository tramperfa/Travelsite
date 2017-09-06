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
      console.log(context);
    }
  }
}
