//
export const openLoginDialog = () => ({type: 'OPEN_LOGIN'})
export const closeLoginDialog = () => ({type: 'CLOSE_DIALOG'})
export const toggleLoginSignupDialog = () => ({type: 'SWITCH_DIALOG'})
export const loadUserInfo = (me) => ({type: 'LOAD_ME', me})
export const logoutUserInfo = () => ({type: 'LOGOUT_ME'})
