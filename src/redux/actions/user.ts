import ActionType from '../actionType'

interface Props {
  id: string | null
  name: string | null
  email: string | null
  foto: string | null
}

export const setUserInfo = ({ id, name, email, foto }: Props) => ({
  type: ActionType.SET_USERINFO,
  payload: { id, name, email, foto },
})

export const deleteUserInfo = () => ({
  type: ActionType.DELETE_USERINFO,
})
