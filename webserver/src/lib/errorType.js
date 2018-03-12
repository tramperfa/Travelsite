const errorType = (type) => {

	//TODO Log Error
	switch (type) {
			// Any-login-User-Action Taken by GUEST
		case 0:
			return new Error("User Not Logged In")
			break;
			// Specific-login-User-Action Taken by GUEST
		case 1:
			return new Error("User Not Authorized")
			break;
		case 2:
			// Server Internal Error
			return new Error("Server Inernal Error")
			break;
		case 3:
			// Illegal Request
			// TODO LOG for Protection/Debug Purpose
			//
			return new Error("Illegal Request")
			break;
		case 4:
			// Specific-login-User-Action Taken by USER, BUT USER DOES NOT HAVE PERMISSION
			// Cannot Find Information
			return new Error("Cannot Find Requested Information")
			break;
		default:
	}

}

export default errorType
