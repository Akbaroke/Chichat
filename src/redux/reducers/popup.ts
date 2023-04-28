import ActionType from '../actionType'

const initialState = {
  isModalStartChat: false,
}

const reducerPopup = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SHOW_STARTCHAT:
      return {
        ...state,
        isModalStartChat: true,
      }
    case ActionType.HIDE_STARTCHAT:
      return {
        ...state,
        isModalStartChat: false,
      }
    default:
      return state
  }
}

export default reducerPopup
