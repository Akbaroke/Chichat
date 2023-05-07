import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { hideStartChat } from '../redux/actions/popup'
import { firestore } from '../config/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineLoading3Quarters,
} from 'react-icons/all'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { setRoomChat } from '../redux/actions/chat'
import Tooltip from '@mui/material/Tooltip'

interface State {
  popup: {
    isModalStartChat: boolean
  }
  user: {
    id: string
    email: string
  }
  chat: {
    friendList: FriendList
  }
}

type FriendList = {
  roomId: string
  userId: string
  name: string
  imgProfile: string
  email: string
}[]

export default function ModalStartChat() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isModalStartChat } = useSelector((state: State) => state.popup)
  const user = useSelector((state: State) => state.user)
  const chat = useSelector((state: State) => state.chat)
  const [email, setEmail] = React.useState('')
  const [idUserTarget, setIdUserTarget] = React.useState('')
  const [isLoadingCheckEmail, setIsLoadingCheckEmail] = React.useState(false)
  const [validateEmail, setValidateEmail] = React.useState('')

  const isEmailRegister = async () => {
    const allUsersRef = collection(firestore, 'users')
    const allUsers = await getDocs(allUsersRef)
    return allUsers.docs.map(doc => {
      if (email === doc.data()?.email) {
        setIdUserTarget(doc.id)
        return true
      }
      return false
    })
  }

  const handleOnChange = async () => {
    setIsLoadingCheckEmail(true)
    if (email !== user.email && email.length > 0) {
      const isRegist = await isEmailRegister()
      if (isRegist.some(val => val)) {
        setValidateEmail('Email found')
      } else {
        setValidateEmail('Email not found')
      }
    } else {
      setValidateEmail('this Email is yours')
    }
    setIsLoadingCheckEmail(false)
  }

  const handleclick = async () => {
    // cek apakah email sudah terdaftar
    if (checkAlready(chat.friendList)[0]) {
      const datas: FriendList = chat.friendList
      datas.map((val, i) => {
        if (val.email === email) {
          dispatch(
            setRoomChat({
              roomId: chat.friendList[i].roomId,
              userId: chat.friendList[i].userId,
              name: chat.friendList[i].name,
              imgProfile: chat.friendList[i].imgProfile,
              email: chat.friendList[i].email,
            })
          )
        }
      })
      navigate('/chat')
    } else {
      const idRoom = uuidv4()
      const usersRef = [
        doc(firestore, 'users', user.id),
        doc(firestore, 'users', idUserTarget),
      ]

      // create room
      try {
        const time = Math.floor(new Date().getTime() / 1000.0)
        const roomsRef = doc(firestore, 'rooms', idRoom)
        await setDoc(roomsRef, {
          chat: [],
          user: usersRef,
          time,
        })
        console.info('Room created Successfully')
      } catch (error) {
        console.error(error)
      }

      // update data user
      try {
        const promises = usersRef.map(async ref => {
          const res = await getDoc(ref)
          const newRooms = [
            ...(res.data()?.rooms ?? []),
            doc(firestore, 'rooms', idRoom),
          ]
          await updateDoc(ref, {
            ...res.data(),
            rooms: newRooms,
          })
        })

        await Promise.all(promises)
        console.info('Users Update Successful')
      } catch (error) {
        console.error(error)
      }

      dispatch(hideStartChat())
      // navigate('/chat')
      setEmail('')
    }
  }

  const checkAlready = datas => {
    return datas.map(val => {
      if (val.email === email) {
        return true
      }
      return false
    })
  }

  return (
    <Transition appear show={isModalStartChat} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(hideStartChat())}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm w-screen h-screen sm:w-[430px] sm:h-[932px] sm:m-auto sm:mt-5 sm:rounded-[30px] sm:shadow-xl sm:border" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto w-screen h-screen sm:w-[430px] sm:h-[932px] sm:m-auto sm:mt-5 sm:rounded-[30px] sm:shadow-xl sm:border">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[10px] bg-[#F6F6F6] text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center bg-white px-[28px] h-[70px]">
                  <h1 className="font-semibold text-[20px]">Start Chat</h1>
                  <button onClick={() => dispatch(hideStartChat())}>
                    <RxCross2 />
                  </button>
                </div>
                <div className="flex flex-col gap-[13px] mt-5 px-[28px] relative">
                  <label htmlFor="email" className="text-[14px]">
                    Destination Email:
                  </label>
                  <input
                    type="email"
                    placeholder="Input here"
                    className="bg-white placeholder:text-[14px] placeholder:font-normal placeholder:text-[#bcbcbc] rounded-[10px] px-5 h-[50px] focus:ring-0 font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyUp={handleOnChange}
                    autoFocus={isModalStartChat ? true : false}
                  />
                  {email.length > 0 ? (
                    <div className="absolute right-10 bottom-4">
                      {isLoadingCheckEmail ? (
                        <div role="status">
                          <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 " />
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : validateEmail === 'Email found' ? (
                        <Tooltip title="Email Found" arrow>
                          <AiOutlineCheckCircle className="text-green-500 cursor-pointer" />
                        </Tooltip>
                      ) : validateEmail === 'Email not found' ? (
                        <Tooltip title="Email Not Found" arrow>
                          <AiOutlineCloseCircle className="text-red-600 cursor-pointer" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="this Email is yours" arrow>
                          <AiOutlineInfoCircle className="text-yellow-400 cursor-pointer" />
                        </Tooltip>
                      )}
                    </div>
                  ) : null}
                </div>
                <button
                  className="w-[150px] h-[40px] bg-blue-500 rounded-lg text-[14px] text-white font-semibold grid place-items-center m-auto my-7 disabled:bg-gray-400"
                  onClick={handleclick}
                  disabled={validateEmail === 'Email found' ? false : true}>
                  Continue
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}