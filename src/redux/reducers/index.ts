import { combineReducers } from '@reduxjs/toolkit'
import reducerUser from './user'
import reducerPopup from './popup'
import reducerChat from './chat'

const rootReducer = combineReducers({
  user: reducerUser,
  popup: reducerPopup,
  chat: reducerChat,
})

export default rootReducer
