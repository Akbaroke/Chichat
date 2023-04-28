import { combineReducers } from '@reduxjs/toolkit'
import reducerUser from './user'
import reducerPopup from './popup'

const rootReducer = combineReducers({
  user: reducerUser,
  popup: reducerPopup,
})

export default rootReducer
