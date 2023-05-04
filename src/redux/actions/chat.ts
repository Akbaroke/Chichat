import ActionType from '../actionType'

interface Props {
  roomId: string | null
  userId: string | null
  name: string | null
  imgProfile: string | null
  email: string | null
}

export const setRoomChat = ({
  roomId,
  userId,
  name,
  imgProfile,
  email,
}: Props) => ({
  type: ActionType.SET_ROOMCHAT,
  payload: { roomId, userId, name, imgProfile, email },
})

export const deleteRoomChat = () => ({
  type: ActionType.DELETE_ROOMCHAT,
})
