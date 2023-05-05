import ActionType from '../actionType'

const initialState = {
  roomId: null,
  userId: null,
  name: null,
  imgProfile: null,
  email: null,
  friendList: [],
}

const reducerChat = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_ROOMCHAT:
      return {
        ...state,
        roomId: action.payload.roomId,
        userId: action.payload.userId,
        name: action.payload.name,
        imgProfile: action.payload.imgProfile,
        email: action.payload.email,
      }
    case ActionType.DELETE_ROOMCHAT:
      return initialState
    case ActionType.SET_FRIENDLIST:
      return {
        ...state,
        friendList: action.payload.friendList,
      }
    default:
      return state
  }
}

export default reducerChat
