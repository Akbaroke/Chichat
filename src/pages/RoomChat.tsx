import clsx from 'clsx'
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import * as React from 'react'
import {
  BiHide,
  BsCheckAll,
  BsSend,
  BsThreeDotsVertical,
  SlArrowLeft,
} from 'react-icons/all'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ScrollToBottom from 'react-scroll-to-bottom'
import { firestore } from '../config/firebase'
import { v4 as uuidv4 } from 'uuid'
import converterTimestamp from '../utils/converterTimestamp'

interface State {
  user: {
    id: string
    name: string
    email: string
    foto: string
  }
  chat: {
    roomId: string
    userId: string
    name: string
    imgProfile: string
    email: string
  }
}

export default function RoomChat() {
  const navigate = useNavigate()
  const { id } = useSelector((state: State) => state.user)
  const chat = useSelector((state: State) => state.chat)
  const [messages, setMessages] = React.useState<DocumentData>([])
  const [currentMessage, setCurrentMessage] = React.useState('')
  const [heightTextArea, setHeightTextArea] = React.useState(50)
  const [chatsRef, setChatsRef] = React.useState<DocumentData | undefined>([])
  const [isChanged, setIsChanged] = React.useState<boolean>(false)

  // get all chatsRef
  React.useEffect(() => {
    const fetch = async () => {
      const roomsRef = doc(firestore, 'rooms', chat.roomId)
      const res = await getDoc(roomsRef)
      const data = res.data()
      setChatsRef(data?.chat)
    }
    fetch()
  }, [chat.roomId, isChanged])

  // get all Chat
  React.useEffect(() => {
    const promisesUsers = chatsRef?.map(async ref => {
      const res = await getDoc(ref)
      return res.data()
    })
    Promise.all(promisesUsers).then(data => {
      setMessages(data)
    })
  }, [chatsRef])

  // realtime
  React.useEffect(() => {
    const listener = () => {
      const ref = collection(firestore, 'chats')
      return onSnapshot(ref, () => {
        setIsChanged(!isChanged)
      })
    }
    const unsubscribe = listener()
    return () => {
      unsubscribe()
    }
  }, [isChanged])

  // read message
  React.useEffect(() => {
    const readMessage = () => {
      messages.map(async item => {
        if (item.userId !== id) {
          const ref = doc(firestore, 'chats', item._id)
          const newData = {
            _id: item._id,
            isHide: item.isHide,
            isRead: true,
            message: item.message,
            time: item.time,
            userId: item.userId,
          }
          await updateDoc(ref, newData)
        }
      })
    }
    readMessage()
  }, [id, messages])

  const handleSendMessage = async () => {
    const message = currentMessage.trim()
    const epochTime = Math.floor(new Date().getTime() / 1000.0)
    if (message !== '') {
      const messageToSend = {
        isHide: false,
        isRead: false,
        message: message,
        time: epochTime,
        userId: id,
        _id: uuidv4(),
      }
      sendMessage(messageToSend)
      console.info('success : ', messageToSend)
      setCurrentMessage('')
      setHeightTextArea(50)
    }
  }

  const sendMessage = async data => {
    const chatsRef = doc(firestore, 'chats', data._id)
    const roomsRef = doc(firestore, 'rooms', chat.roomId)

    try {
      await setDoc(chatsRef, data)
      const res = await getDoc(roomsRef)
      const fieldChat = res.data()?.chat
      fieldChat.push(chatsRef)
      await updateDoc(roomsRef, {
        ...res.data(),
        chat: fieldChat,
      })
      console.info(fieldChat)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = e => {
    setCurrentMessage(e.target.value)
    setHeightTextArea(e.target.scrollHeight)
    if (e.target.scrollHeight <= 50) {
      setHeightTextArea(50)
    }
    if (e.target.value.length <= 20) {
      setHeightTextArea(50)
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
      setHeightTextArea(50)
    } else if (e.key === 'Backspace') {
      if (e.target.scrollHeight <= 50) {
        console.log()
        setHeightTextArea(50)
      } else {
        setHeightTextArea(e.target.scrollHeight - 10)
      }
    }
  }

  return (
    <div className="bg-[#F6F6F6] w-full h-full relative">
      <div className="flex items-center justify-between px-[25px] h-24 bg-white">
        <div className="flex items-center gap-[20px]">
          <SlArrowLeft
            onClick={() => navigate(-1)}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="flex gap-[14px] items-center">
            <img
              src={chat.imgProfile}
              alt={chat.name}
              className="rounded-full"
              width={50}
              height={50}
            />
            <div className="flex flex-col items-start gap-[3px]">
              <h1 className="font-semibold text-[15px] capitalize">
                {chat.name}
              </h1>
              <p className="font-normal text-[12px] text-[#A0A0A0]">
                {chat.email}
              </p>
            </div>
          </div>
        </div>
        <BsThreeDotsVertical className="w-6 h-6 text-[#CBCBCB] cursor-pointer hover:text-black" />
      </div>
      <div className="py-5">
        <div className="flex justify-center gap-4 items-center px-[25px]">
          <span className="w-full h-[1px] rounded-sm bg-[#BCBCBC]/50"></span>
          <p className="text-[12px] text-[#bcbcbc] whitespace-nowrap">
            Today, 12 July
          </p>
          <span className="w-full h-[1px] rounded-sm bg-[#BCBCBC]/50"></span>
        </div>
      </div>
      <ScrollToBottom className="px-[25px] flex flex-col gap-3">
        {messages?.map((data, i) =>
          data.userId === id ? (
            <Me data={data} key={i} />
          ) : (
            <div key={i}>
              <div className="p-[17px] bg-white rounded-[15px] text-[12px] whitespace-normal font-medium w-max max-w-[70%]">
                {data.isHide ? (
                  <i className="text-[#BCBCBC] font-normal">
                    Message has been hidden
                  </i>
                ) : (
                  data.message
                )}
              </div>
              <p className="font-medium text-[9px] text-[#BCBCBC] mt-1 ml-1">
                {converterTimestamp(data.time)}
              </p>
            </div>
          )
        )}
      </ScrollToBottom>
      <div className="absolute bottom-0 w-full">
        <div className="w-full relative h-[106px] bg-white py-[23px] px-[25px] flex justify-between gap-3 items-center">
          <textarea
            typeof="text"
            placeholder="Type here.."
            value={currentMessage}
            maxLength={300}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`rounded-xl bg-[#f6f6f6] h-[${heightTextArea}px] outline-none resize-none py-3 px-5 flex-grow`}
          />
          {currentMessage.trim().replace(' ', '').length > 0 && (
            <div className="w-[47px] h-[47px] rounded-full bg-blue-500 cursor-pointer grid place-items-center hover:shadow-lg transition-all">
              <BsSend
                onClick={handleSendMessage}
                className="w-5 h-5 text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Me({ data }) {
  const [isHovering, setIsHovering] = React.useState(false)
  const [hoveringId, setHoveringId] = React.useState('')

  return (
    <div
      className="flex flex-col text-right items-end "
      onMouseEnter={() => {
        setIsHovering(true)
        setHoveringId(data._id)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        setHoveringId(data._id)
      }}>
      <div
        className={clsx(
          'p-[17px] bg-blue-500 text-white rounded-[15px] text-[12px] whitespace-normal font-medium w-max max-w-[70%] relative',
          data.isHide && 'line-through italic'
        )}>
        {data.message}
        {isHovering && hoveringId === (data._id as string) ? (
          <BiHide className="absolute top-1 -left-7 transform translate-y-1/2 text-[#BCBCBC] w-5 h-5 cursor-pointer hover:text-black transition-all" />
        ) : null}
      </div>
      <p className="font-medium text-[9px] text-[#BCBCBC] mt-1 ml-1 inline-flex items-center gap-1">
        {converterTimestamp(data.time)}
        <BsCheckAll
          className={clsx(
            'w-4 h-4 mb-[3px]',
            data.isRead ? 'text-[#70C996]' : 'text-[#C2C2C2]'
          )}
        />
      </p>
    </div>
  )
}
