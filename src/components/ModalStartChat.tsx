import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { hideStartChat } from '../redux/actions/popup'
import { firestore } from '../config/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineLoading3Quarters,
} from 'react-icons/all'
import { Tooltip } from 'flowbite-react'
import { v4 as uuidv4 } from 'uuid'

interface State {
  popup: {
    isModalStartChat: boolean
  }
  user: {
    email: string
  }
}

export default function ModalStartChat() {
  const dispatch = useDispatch()
  const { isModalStartChat } = useSelector((state: State) => state.popup)
  const user = useSelector((state: State) => state.user)
  const [email, setEmail] = React.useState('')
  const [isLoadingCheckEmail, setIsLoadingCheckEmail] = React.useState(false)
  const [validateEmail, setValidateEmail] = React.useState('')

  const isEmailRegister = async email => {
    const usersRef = doc(firestore, 'users', email)
    const data = await getDoc(usersRef)
    if (data.data()) {
      return true
    }
    return false
  }

  const handleOnChange = async e => {
    setIsLoadingCheckEmail(true)
    const email = e.target.value
    if (email !== user.email && email.length > 0) {
      if (await isEmailRegister(email)) {
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
    const idRoom = uuidv4()
    const idHistory = uuidv4()

    const roomChatRef = doc(firestore, 'room_chat', idRoom)
    setDoc(roomChatRef, {
      _id: idRoom,
      id_messageHistory: idHistory,
      lastMessage: {
        from: '',
        isRead: false,
        messages: [],
        timestamp: Math.floor(new Date().getTime() / 1000.0),
      },
      user1: user.email,
      user2: email,
    })
      .then(() => {
        console.info('room chat berhasil di buat')
      })
      .catch(err => {
        console.error(err)
      })

    // update rooms user1
    const user1_Ref = doc(firestore, 'users', user.email)
    const user1_data = await getDoc(user1_Ref)
    const user1_roomsBefore = user1_data.data()?.rooms
    user1_roomsBefore.push(idRoom)
    await updateDoc(user1_Ref, {
      ...user1_data.data(),
      rooms: user1_roomsBefore,
    })
      .then(() => {
        console.info('update users1')
      })
      .catch(err => {
        console.error(err)
      })

    // update rooms user2
    const user2_Ref = doc(firestore, 'users', email)
    const user2_data = await getDoc(user2_Ref)
    const user2_roomsBefore = user2_data.data()?.rooms
    user2_roomsBefore.push(idRoom)
    await updateDoc(user2_Ref, {
      ...user2_data.data(),
      rooms: user2_roomsBefore,
    })
      .then(() => {
        console.info('update users2')
      })
      .catch(err => {
        console.error(err)
      })

    // create message history
    const messageHistoryRef = doc(firestore, 'message_history', idHistory)
    setDoc(messageHistoryRef, {
      _id: idHistory,
      id_roomChat: idRoom,
      messages: [],
      user1: user.email,
      user2: email,
    })
      .then(() => {
        console.info('message history berhasil di buat')
      })
      .catch(err => {
        console.error(err)
      })

    dispatch(hideStartChat())
    setEmail('')
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
                  />
                  {email.length > 0 ? (
                    <div className="absolute right-10 bottom-4">
                      {isLoadingCheckEmail ? (
                        <div role="status">
                          <AiOutlineLoading3Quarters className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 " />
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : validateEmail === 'Email found' ? (
                        <Tooltip
                          content="Email Found"
                          placement="bottom"
                          className="whitespace-nowrap"
                          arrow={false}>
                          <AiOutlineCheckCircle className="text-green-500 cursor-pointer" />
                        </Tooltip>
                      ) : validateEmail === 'Email not found' ? (
                        <Tooltip
                          content="Email Not Found"
                          placement="bottom"
                          className="whitespace-nowrap"
                          arrow={false}>
                          <AiOutlineCloseCircle className="text-red-600 cursor-pointer" />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          content="this Email is yours"
                          placement="bottom"
                          className="whitespace-nowrap"
                          arrow={false}>
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

// const usersRef = doc(firestore, 'users', user.email)
// const data = await getDoc(usersRef)
// const res = data.data()
// const room = await res?.rooms
