const initialState = {
	loading: true,
	me: {
		_id: '',
		fullName: '',
		likeStory: [],
		archiveStory: []
	}
}

const userLocalStore = (state = initialState, action) => {
	//console.log(action);
	switch (action.type) {
		case 'LOAD_ME':
			//console.log(action.me);
			return Object.assign({}, state, {
				loading: false,
				me: action.me
			})
		case 'LOGOUT_ME':
			return Object.assign({}, state, {
				loading: false,
				me: initialState.me
			})
		default:
			return state;
	}

}

export default userLocalStore
