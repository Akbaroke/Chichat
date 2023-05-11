import ActionType from '../actionType'

export const showStartChat = () => ({
  type: ActionType.SHOW_STARTCHAT,
})

export const hideStartChat = () => ({
  type: ActionType.HIDE_STARTCHAT,
})

export const showConfirmLogout = () => ({
  type: ActionType.SHOW_CONFIRMLOGOUT,
})

export const hideConfirmLogout = () => ({
  type: ActionType.HIDE_CONFIRMLOGOUT,
})
