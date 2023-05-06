import * as React from 'react'
import { signOut } from 'firebase/auth'
import {
  AiOutlineLogout,
  AiOutlinePlus,
  BsCheckAll,
  RiSearchLine,
  RxCross2,
} from 'react-icons/all'
import { auth, firestore } from '../config/firebase'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserInfo } from '../redux/actions/user'
import clsx from 'clsx'
import ModalStartChat from '../components/ModalStartChat'
import { showStartChat } from '../redux/actions/popup'
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore'
import converterTimestamp from '../utils/converterTimestamp'
import { setFriendList, setRoomChat } from '../redux/actions/chat'
import ListRoomsSkeleton from '../components/ListRoomsSkeleton'
import Tooltip from '@mui/material/Tooltip'
import { AnimatePresence, motion } from 'framer-motion'

interface State {
  user: {
    id: string
    email: string
  }
}

interface UsersId {
  user: DocumentReference[]
  chat: DocumentReference[]
  time: DocumentReference[]
}

const variants = {
  flip: {
    rotateY: 360,
    transition: {
      duration: 0.3,
    },
  },
}

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: State) => state.user)
  const [isActiveSearch, setIsActiveSearch] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [users, setUsers] = React.useState<DocumentData>([])
  const [chats, setChats] = React.useState<DocumentData>([])
  const [listRoom, setListRoom] = React.useState<DocumentData>([])
  const [roomsId, setRoomsId] = React.useState<DocumentData>([])
  const [usersId, setUsersId] = React.useState<DocumentData>([])
  const [times, setTimes] = React.useState<DocumentData>([])

  React.useEffect(() => {
    const unsubscribeChats = onSnapshot(collection(firestore, 'chats'), () => {
      console.info('chats changed')
      fetch()
    })

    const unsubscribeRooms = onSnapshot(collection(firestore, 'rooms'), () => {
      console.info('rooms changed')
      fetch()
    })

    const unsubscribeUsers = onSnapshot(collection(firestore, 'users'), () => {
      console.info('users changed')
      fetch()
    })

    return () => {
      unsubscribeRooms()
      unsubscribeUsers()
      unsubscribeChats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // merged
  React.useEffect(() => {
    if (chats?.length > 0 && users?.length > 0) {
      const merged = users?.map((item, index) => ({
        ...item,
        detailMessage: chats[index],
        roomId: roomsId[index],
        id: usersId[index],
        time: times[index],
      }))
      console.info('merged :', merged)
      setListRoom(merged)
    }
  }, [users, chats, roomsId, usersId, times])

  React.useEffect(() => {
    if (listRoom?.length > 0) {
      const data = listRoom.map(val => ({
        roomId: val.roomId,
        userId: val.id,
        name: val.name,
        imgProfile: val.imgProfile,
        email: val.email,
      }))
      dispatch(setFriendList(data))
    }
  }, [dispatch, listRoom])

  // Ngambil roomsRef dari users
  const fetch = async () => {
    try {
      const ref = doc(firestore, 'users', user.id)
      const data = await getDoc(ref)
      const roomsRef = data.data()?.rooms

      const promisesUsers = roomsRef?.map(async ref => {
        const res = await getDoc(ref)
        const data = res.data() as UsersId
        return data.user
      })
      Promise.all(promisesUsers).then(data => {
        fetchUsers(data)
      })

      // Ngambil chatsRef dari roomsRef
      const promisesChats = roomsRef?.map(async ref => {
        const res = await getDoc(ref)
        const data = res.data() as UsersId
        return data.chat
      })
      Promise.all(promisesChats).then(data => {
        fetchChats(data)
      })

      // get usersId
      const promisesRooms = roomsRef?.map(async ref => {
        const res = await getDoc(ref)
        return res.id
      })
      Promise.all(promisesRooms).then(data => {
        setRoomsId(data)
      })

      // get time
      const promisesTimes = roomsRef?.map(async ref => {
        const res = await getDoc(ref)
        const data = res.data() as UsersId
        return data.time
      })
      Promise.all(promisesTimes).then(data => {
        setTimes(data)
      })

      setIsLoading(false)
    } catch (error) {
      console.error(error)
      navigate('/login')
    }
  }

  const fetchUsers = async usersRef => {
    const promises = usersRef?.map(async i => {
      const promisesRef = i.map(async ref => {
        const res = await getDoc(ref)
        const data = res.data() as UsersId
        return data
      })
      return Promise.all(promisesRef)
    })
    const resultPromise = await Promise.all(promises)
    const flattenArr = resultPromise.flat()
    const result = flattenArr.reduce((acc, curr) => {
      if (curr.email !== user.email) {
        const existingItem = acc.find(item => item.id === curr.email)
        if (!existingItem) {
          acc.push(curr)
        }
      }
      return acc
    }, [])

    const allUsersRef = collection(firestore, 'users')
    const allUsers = getDocs(allUsersRef)
    allUsers.then(data => {
      const userIds = data.docs
        .map((doc: DocumentSnapshot<DocumentData>) => {
          const matchedUser = result?.find(u => u.email === doc.data()?.email)
          if (matchedUser) {
            return doc.id
          }
        })
        .filter(Boolean)
      setUsersId(userIds)
    })

    setUsers(result)
  }

  const fetchChats = async chatsRef => {
    const promises = chatsRef?.map(async i => {
      const promisesRef = i.map(async ref => {
        const res = await getDoc(ref)
        const data = res.data() as UsersId
        return data
      })
      return Promise.all(promisesRef)
    })
    const resultPromise = await Promise.all(promises)
    setChats(resultPromise)
  }

  const signOutFromApp = () => {
    signOut(auth)
      .then(() => {
        navigate('/login')
        dispatch(deleteUserInfo())
      })
      .catch(err => {
        console.error(err)
      })
  }

  const countLastMessage = datas => {
    let count = 0
    datas.forEach(i => {
      if (!i.isRead) {
        count += 1
      }
    })
    return count
  }

  const sortBySearch = listRoom?.filter(data =>
    data.name.toLowerCase().includes(search.toLowerCase())
  )
  const sortedByTime = listRoom?.sort((a, b) => b.time - a.time)
  const resultRooms = search.length > 0 ? sortBySearch : sortedByTime

  return (
    <div className="w-full h-full relative">
      <ModalStartChat />
      {!isActiveSearch ? (
        <div
          className={clsx(
            'flex justify-between items-center h-[70px] px-[25px] sticky top-0 bg-white shadow-lg shadow-white outline outline-gray-300/40 outline-1'
          )}>
          <h1 className="font-semibold text-[24px]">Chichat</h1>
          <div className="flex gap-2">
            <Tooltip title="Search" arrow>
              <button
                className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-[#CACACA] hover:text-black transition-all"
                onClick={() => setIsActiveSearch(true)}>
                <RiSearchLine className="w-5 h-5" />
              </button>
            </Tooltip>
            <Tooltip title="Search" arrow>
              <button
                className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-[#CACACA] hover:text-black transition-all"
                onClick={signOutFromApp}>
                <AiOutlineLogout className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div
          className={clsx(
            'h-[70px] py-2 px-[25px] sticky top-0 bg-white shadow-lg shadow-white'
          )}>
          <div className="max-w-md mx-auto">
            <div className="relative flex items-center w-full h-12 rounded-lg shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-12 w-12 text-[#CACACA] ">
                <RiSearchLine />
              </div>

              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 focus:ring-0"
                type="text"
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search something.."
              />
              <div
                className="grid place-items-center h-12 w-12 text-[#CACACA] cursor-pointer hover:text-black transition-all"
                onClick={() => {
                  setIsActiveSearch(false)
                  setSearch('')
                }}>
                <RxCross2 />
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <ListRoomsSkeleton cards={5} />
      ) : (
        <div className="max-h-[90%] overflow-x-hidden overflow-y-auto">
          <AnimatePresence>
            {resultRooms?.map((data, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex justify-between items-center py-3 cursor-pointer px-[25px] hover:bg-gray-100"
                  onClick={() => {
                    dispatch(
                      setRoomChat({
                        roomId: data.roomId,
                        userId: data.id,
                        name: data.name,
                        imgProfile: data.imgProfile,
                        email: data.email,
                      })
                    )
                    navigate(`/chat`)
                  }}>
                  <div className="flex gap-[20px] items-center">
                    <img
                      src={data.imgProfile}
                      alt={data.name}
                      className="rounded-full"
                      width={60}
                      height={60}
                    />
                    <div className="flex flex-col items-start gap-[5px]">
                      <h1 className="font-semibold text-[15px] capitalize">
                        {data.name}
                      </h1>
                      {data.detailMessage?.length > 0 ? (
                        <p
                          className={clsx(
                            'font-normal text-[12px] text-[#A0A0A0] truncate max-w-[180px]',
                            data.detailMessage[data.detailMessage.length - 1]
                              .isHide &&
                              data.detailMessage[data.detailMessage.length - 1]
                                .userId === user.id &&
                              'italic text-opacity-50',
                            data.detailMessage[data.detailMessage.length - 1]
                              .isHide &&
                              data.detailMessage[data.detailMessage.length - 1]
                                .userId === user.id &&
                              'line-through'
                          )}>
                          {data.detailMessage[data.detailMessage.length - 1]
                            .isHide &&
                          data.detailMessage[data.detailMessage.length - 1]
                            .userId === user.id
                            ? data.detailMessage[data.detailMessage.length - 1]
                                .message
                            : data.detailMessage[data.detailMessage.length - 1]
                                .isHide
                            ? 'Message has been hidden'
                            : data.detailMessage[data.detailMessage.length - 1]
                                .message}
                        </p>
                      ) : (
                        <i className="font-normal text-[12px] text-[#70C996] truncate max-w-[150px]">
                          chat room just create
                        </i>
                      )}
                    </div>
                  </div>
                  {data.detailMessage.length > 0 ? (
                    <div className="flex flex-col items-end gap-[5px]">
                      <p className="font-normal text-[12px] text-[#A0A0A0]">
                        {converterTimestamp(
                          data?.detailMessage[data.detailMessage.length - 1]
                            .time
                        )}
                      </p>
                      {data?.detailMessage[data.detailMessage.length - 1]
                        .userId !== user.id ? (
                        <div
                          className={clsx(
                            'inline-flex items-center justify-center px-[7px] py-1 text-[10px] font-bold leading-none text-red-100 bg-red-600 rounded-full',
                            countLastMessage(data.detailMessage) < 1 &&
                              'invisible'
                          )}>
                          {countLastMessage(data.detailMessage)}
                        </div>
                      ) : (
                        <>
                          {data?.detailMessage[data.detailMessage.length - 1]
                            .isRead ? (
                            <motion.div variants={variants} animate="flip">
                              <BsCheckAll className="w-4 h-4 mb-[3px] text-[#70C996]" />
                            </motion.div>
                          ) : (
                            <BsCheckAll className="w-4 h-4 mb-[3px] text-[#C2C2C2]" />
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-[5px]">
                      <p className="font-normal text-[12px] text-[#A0A0A0]">
                        {converterTimestamp(data.time)}
                      </p>
                      <span className="w-5 h-5 invisible"></span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
      {!isLoading ? (
        <Tooltip title="Start chat" placement="top" arrow>
          <div
            className="grid place-items-center bg-blue-500 text-white rounded-full w-12 h-12 cursor-pointer shadow-md absolute left-1/2 transform -translate-x-1/2 bottom-10"
            onClick={() => dispatch(showStartChat())}>
            <AiOutlinePlus className="w-6 h-6" />
          </div>
        </Tooltip>
      ) : null}
    </div>
  )
}
