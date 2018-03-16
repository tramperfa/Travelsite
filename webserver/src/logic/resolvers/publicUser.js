import User from '../models/user';

module.exports = {
	Query: {
		PublicUserByID: async (parent, args) => {
			return User.load(args.userID)
		}
	}
}
