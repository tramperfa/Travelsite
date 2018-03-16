import errorType from "../../lib/errorType"
import {checkLoginBoolean} from "../../lib/resolverHelpers"

// const { AuthorizationError } = require('./../errors'); Implement resolvers
// for out custom Directive
const directiveResolvers = {
	auth(next, src, args, context, info) {
		const userRole = checkLoginBoolean(context)
			? context.sessionUser.user.role
			: "GUEST"
		//console.log("userRole: " + userRole);
		switch (args.role) {
			case "USER":
				console.log("USER AUTH IS CALLED")
				if (userRole == "GUEST") {
					throw errorType(0)
				} else {
					return next()
				}
				break
			case "OWNER":
				console.log("OWNER AUTH IS CALLED")
				if (userRole == "GUEST") {
					throw errorType(1)
				} else if (userRole == "ADMIN") {
					return next()
				} else {
					console.log("Pass Dow Owner Enforcement")
					info.authAdd = {
						checkOwner: true
					}
					context.authAdd = {
						checkOwner: true
					}
					return next()
				}
				break
			case "ADMIN":
				console.log("ADMIN AUTH IS CALLED")
				if (userRole != "ADMIN") {
					// False Claim as Admin
					// TODO LOG!!!!
					console.log("SOMEONE HACKED AS ADMIN!")
					throw errorType(4)
				} else {
					return next()
				}
				break
			default:
		}
	}
}

module.exports = {
	directiveResolvers
}
