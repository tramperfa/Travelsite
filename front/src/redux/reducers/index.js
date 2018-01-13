import {combineReducers} from 'redux'
import loginDialog from './loginDialog'
import auth from './auth'

const rootReducer = combineReducers({loginDialog, auth})

export default rootReducer
