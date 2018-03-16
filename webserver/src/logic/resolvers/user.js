import User from '../models/user';
import passport from 'passport';
import errorType from '../../lib/errorType';

module.exports = {
	Query: {
		userByID: async (parent, {userID}) => {
			return User.load(userID)
		},
		userSelf: async (parent, {
			userID
		}, context) => {
			console.log("userSelf QUERY WITH ID : " + userID);
			if (context.sessionUser && context.sessionUser.user && context.sessionUser.user._id) {
				return User.load(context.sessionUser.user._id)
			} else {
				// DO NOT THROW ERROR, OTHERWISE CAN CAUSE REDIRECT
				return undefined
			}
		}
	},
	Mutation: {
		registerUser: async (parent, args) => {
			const user = args.input
			return User.create(user)
		},
		localLogin: async (parent, args, context) => {
			const user = await willLogin(
				context.req,
				args.input.email,
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

const willLogin = async (req, email, password) => {
	// To let passport-local consume
	req.body.email = email
	req.body.password = password
	return await willAuthenWithPassport('local', req).catch(err => err)
	// .catch(onError(req))
}

const willAuthenWithPassport = (strategy, req) => new Promise(
	(resolve, reject) => {

		passport.authenticate(strategy, (err, user, info) => {
			if (err) {
				//TODO LOG
				console.log(err);
				return reject(errorType(2))
			}
			//console.log(user);
			return user
				? resolve(user)
				: reject(new Error(info.message))
		})(req)

	}
)

const willDestroySession = (req) => new Promise((resolve, reject) => {
	req.session.destroy(function (err) {
		if (err) {
			//TODO LOG
			console.log(err);
			return reject(errorType(2))
		}
		return resolve({success: true})
	})
})
