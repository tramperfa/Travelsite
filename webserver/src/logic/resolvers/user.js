import User from '../models/user';
import passport from 'passport';

module.exports = {
	Query: {
		user: async (parent, _id, context) => {
			return User.load(_id)
		},
		me: async (parent, args, context) => {
			if (context.sessionUser) {
				return User.load(context.sessionUser.user._id)
			}
			// return new Error('You must login to continue')

			return null
		}
	},
	Mutation: {
		registerUser: async (parent, args, context) => {
			if (context.sessionUser._id) {
				return new Error("user already has an account and logged in!")
			}
			const user = args.input
			return User.create(user)
		},
		localLogin: async (parent, args, context) => {
			// Prevent Logged in user keeps hiting login GraphQL mutation if
			// (context.sessionUser != null) {   return new Error("User already logged in")
			// }
			const user = await willLogin(
				context.req,
				args.input.emailorusername,
				args.input.password
			)
			await willCreateSession(context.req, user)
			var result = {
				me: user
			}
			return result

		},
		logout: async (parent, args, context) => {
			const result = await willDestroySession(context.req)
			return result
		}

	}
}

const willCreateSession = (req, user) => new Promise((resolve, reject) => {
	if (user) {
		req.logIn(user, function (err) {
			if (err) {
				return reject(new Error(err))
			}
			req.session.save(function (err) {
				if (err) {
					return reject(new Error(err))
				}
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
	// .catch(onError(req))
}

const willAuthenWithPassport = (strategy, req) => new Promise(
	(resolve, reject) => {

		passport.authenticate(strategy, (err, user, info) => {
			if (err) {
				return reject(new Error(err))
			}
			return user
				? resolve(user)
				: reject(new Error(info.message))
		})(req)

	}
)

const willDestroySession = (req) => new Promise((resolve, reject) => {
	req.session.destroy(function (err) {
		if (err) {
			return reject(new Error(err))
		}

		return resolve({success: true})
	})
})
