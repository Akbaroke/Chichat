import ActionType from '../actionType'

const initialState = {
  name: null,
  email: null,
  foto: null,
}

const reducerUser = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_USERINFO:
      return {
        name: action.payload.name,
        email: action.payload.email,
        foto: action.payload.foto,
      }
    case ActionType.DELETE_USERINFO:
      return initialState
    default:
      return state
  }
}

export default reducerUser
