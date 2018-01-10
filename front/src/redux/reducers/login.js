import {OPEN_LOGIN, CLOSE_LOGIN} from '../ActionTypes';

const initialState = {
	openLogin: false
}

const login = (state = initialState, action) => {
	switch (action.type) {
		case OPEN_LOGIN:
			return Object.assign({}, state, {openLogin: true})
		case CLOSE_LOGIN:
			return Object.assign({}, state, {openLogin: false})
		default:
			return state;
	}

}

export default login
