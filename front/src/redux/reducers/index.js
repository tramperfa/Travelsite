import {combineReducers} from 'redux'
import loginDialog from './loginDialog'
import userLocalStore from './userLocalStore'

const rootReducer = combineReducers({loginDialog, userLocalStore})

export default rootReducer
