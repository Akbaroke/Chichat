import ActionType from '../actionType'

interface Props {
  name: string | null
  email: string | null
  foto: string | null
}

export const setUserInfo = ({ name, email, foto }: Props) => ({
  type: ActionType.SET_USERINFO,
  payload: { name, email, foto },
})

export const deleteUserInfo = () => ({
  type: ActionType.DELETE_USERINFO,
})
