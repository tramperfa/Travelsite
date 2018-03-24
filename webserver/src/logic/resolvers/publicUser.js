import User from '../models/user';

module.exports = {
	Query: {
		PublicUserByID: async (parent, args) => {
			//console.log("CALLED WITH USERID : " + args.userID);
			return User.load(args.userID)
		}
	}
}
