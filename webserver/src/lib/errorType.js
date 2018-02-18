const errorType = (type) => {
	// console.log("TYPE ::::::"); console.log(type);
	switch (type) {
			// Any-login-User-Action
		case 0:
			return new Error('User Not Logged In')
			break;
			// Specific-login-User-Action
		case 1:
			return new Error('User Not Authorized')
			break;
		case 2:
			// Server Internal Error
			return new Error('Server Inernal Error')
			break;
		case 3:
			// Illegal Request
			return new Error('Illegal Request')
			break;
		case 4:
			// Cannot Find Information
			return new Error('Cannot Find Requested Information')
			break;
		default:
			return new Error('Illegal Request')
	}

}

export default errorType;
