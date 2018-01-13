const initialState = {
	openLogin: false
}

const loginDialog = (state = initialState, action) => {
	switch (action.type) {
		case 'OPEN_LOGIN':
			return Object.assign({}, state, {openLogin: true})
		case 'CLOSE_LOGIN':
			return Object.assign({}, state, {openLogin: false})
		default:
			return state;
	}
}

export default loginDialog
