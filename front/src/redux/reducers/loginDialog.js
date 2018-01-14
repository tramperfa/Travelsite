const initialState = {
	openLogin: false,
	switchToSignup: false
}

const loginDialog = (state = initialState, action) => {
	switch (action.type) {
		case 'OPEN_LOGIN':
			return Object.assign({}, state, {openLogin: true})
		case 'CLOSE_DIALOG':
			return Object.assign({}, state, {openLogin: false})
		case 'SWITCH_DIALOG':
			return Object.assign({}, state, {
				switchToSignup: !state.switchToSignup
			})
		default:
			return state;
	}
}

export default loginDialog
