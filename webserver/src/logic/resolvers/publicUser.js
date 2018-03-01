import User from '../models/user';

module.exports = {
	Query: {
		PublicUserByID: async (parent, args, context, info) => {
			return User.load(args.userID)
		}
	}
}
