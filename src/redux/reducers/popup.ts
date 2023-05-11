import ActionType from '../actionType'

const initialState = {
  isModalStartChat: false,
  isModalConfirmLogout: false,
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
    case ActionType.SHOW_CONFIRMLOGOUT:
      return {
        ...state,
        isModalConfirmLogout: true,
      }
    case ActionType.HIDE_CONFIRMLOGOUT:
      return {
        ...state,
        isModalConfirmLogout: false,
      }
    default:
      return state
  }
}

export default reducerPopup
