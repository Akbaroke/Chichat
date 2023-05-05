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
import { firestore } from '../config/firebase'
import { v4 as uuidv4 } from 'uuid'
import converterTimestamp from '../utils/converterTimestamp'
import ScrollToBottom from 'react-scroll-to-bottom'

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

  // realtime
  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'chats'), () => {
      console.info('changed')
      fetch()
    })
    return unsubscribe
    // eslint-disable-next-line
  }, [])

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

  const fetch = async () => {
    const roomsRef = doc(firestore, 'rooms', chat.roomId)
    const res = await getDoc(roomsRef)
    const data = res.data()
    const chatsRef = data?.chat
    const promisesUsers = chatsRef?.map(async ref => {
      const res = await getDoc(ref)
      return res.data()
    })
    Promise.all(promisesUsers).then(data => {
      setMessages(data)
    })
  }

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
      fetch()
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

  // Mengambil timestamp untuk hari ini
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime()
  console.info({ today, todayTimestamp })

  // Mendefinisikan fungsi untuk membandingkan tanggal pesan chat
  const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
    const date1 = new Date(timestamp1)
    const date2 = new Date(timestamp2)
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Mengurutkan pesan chat berdasarkan tanggal terbaru
  const sortedMessages = messages.sort((a, b) => a.time - b.time)
  console.info({ sortedMessages })

  // Memisahkan pesan chat berdasarkan tanggal
  const messagesByDay: Record<number, typeof sortedMessages> = {}
  sortedMessages.forEach(message => {
    const timestamp = message.time
    const messageDay = new Date(timestamp * 1000.0)
    console.info({ timestamp, messageDay })
    messageDay.setHours(0, 0, 0, 0)
    const messageDayTimestamp = messageDay.getTime()
    if (!messagesByDay[messageDayTimestamp]) {
      messagesByDay[messageDayTimestamp] = []
    }
    messagesByDay[messageDayTimestamp].push(message)
  })

  return (
    <div className="w-full h-full relative bg-[#F6F6F6]">
      {/* Header Chat */}
      <div className="flex items-center justify-between sticky top-0 px-[25px] h-24 bg-white z-20">
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

      {/* Body Chat */}
      <ScrollToBottom className="h-full max-h-screen overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-4 px-[25px] pb-52">
          {Object.entries(messagesByDay).map(([timestamp, messages]) => {
            const messageDay = new Date(Number(timestamp))
            const isToday = isSameDay(todayTimestamp, Number(timestamp))
            const dateText = isToday
              ? 'Today'
              : messageDay.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
            return (
              <div key={timestamp}>
                <div className="py-5">
                  <div className="flex justify-center gap-4 items-center px-[25px]">
                    <span className="w-full h-[1px] rounded-sm bg-[#BCBCBC]/50"></span>
                    <p className="text-[12px] text-[#bcbcbc] whitespace-nowrap">
                      {dateText}
                    </p>
                    <span className="w-full h-[1px] rounded-sm bg-[#BCBCBC]/50"></span>
                  </div>
                </div>
                {messages.map(message =>
                  message.userId === id ? (
                    <Me data={message} key={message._id} />
                  ) : (
                    <div key={message._id}>
                      <div className="p-[17px] bg-white rounded-[15px] text-[12px] whitespace-normal break-words font-medium w-max max-w-[70%]">
                        {message.isHide ? (
                          <i className="text-[#BCBCBC] font-normal">
                            Message has been hidden
                          </i>
                        ) : (
                          message.message
                        )}
                      </div>
                      <p className="font-medium text-[9px] text-[#BCBCBC] mt-1 ml-1">
                        {converterTimestamp(message.time)}
                      </p>
                    </div>
                  )
                )}
              </div>
            )
          })}
        </div>
      </ScrollToBottom>

      {/* text input Chat */}
      <div className="w-full bg-white py-[23px] px-[25px] sticky bottom-0 z-10">
        <div className="grid grid-cols-[6fr,1fr] gap-3 items-center">
          <textarea
            typeof="text"
            placeholder="Type here.."
            value={currentMessage}
            maxLength={300}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`rounded-xl bg-[#f6f6f6] h-[${heightTextArea}px] outline-none resize-none py-3 px-5 w-full`}
          />
          <button
            className={clsx(
              'w-[47px] h-[47px] rounded-full bg-blue-500 grid place-items-center transition-all shadow-xl',
              'hover:shadow-lg',
              'disabled:bg-gray-400 disabled:shadow-none'
            )}
            disabled={
              currentMessage.trim().replace(' ', '').length > 0 ? false : true
            }
            onClick={handleSendMessage}>
            <BsSend className="w-5 h-5 text-white" />
          </button>
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
          'p-[17px] bg-blue-500 text-white rounded-[15px] text-[12px] whitespace-normal break-words font-medium w-max max-w-[70%] relative rounded-tr-none text-left',
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

{
  /* data.userId === id ? (
  <Me data={data} key={i} />
) : (
  <div key={i}>
    <div className="p-[17px] bg-white rounded-[15px] text-[12px] whitespace-normal break-words font-medium w-max max-w-[70%]">
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
) */
}