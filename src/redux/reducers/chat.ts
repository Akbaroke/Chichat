import ActionType from '../actionType'

const initialState = {
  roomId: null,
  userId: null,
  name: null,
  imgProfile: null,
  email: null,
}

const reducerChat = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_ROOMCHAT:
      return {
        roomId: action.payload.roomId,
        userId: action.payload.userId,
        name: action.payload.name,
        imgProfile: action.payload.imgProfile,
        email: action.payload.email,
      }
    case ActionType.DELETE_ROOMCHAT:
      return initialState
    default:
      return state
  }
}

export default reducerChat
