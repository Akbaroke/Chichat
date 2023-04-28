import { combineReducers } from '@reduxjs/toolkit'
import reducerUser from './user'

const rootReducer = combineReducers({
  user: reducerUser,
})

export default rootReducer
