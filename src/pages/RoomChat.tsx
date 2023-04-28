import clsx from 'clsx'
import * as React from 'react'
import {
  BiHide,
  BsCheckAll,
  BsThreeDotsVertical,
  SlArrowLeft,
} from 'react-icons/all'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ScrollToBottom from 'react-scroll-to-bottom'

const fakeChat = [
  {
    _id: 1,
    message: 'Hello Bro! Can you check figma for next weeks shot?',
    timestapm: '12:23 PM',
    email: 'joni@gmail.com',
    isRead: true,
    isHide: false,
  },
  {
    _id: 2,
    message: 'Sure! can you send the figma links?',
    timestapm: '12:23 PM',
    email: 'akbarmuhammad833@gmail.com',
    isRead: true,
    isHide: false,
  },
  {
    _id: 3,
    message: 'Im very happy to hear feedback from you.',
    timestapm: '12:23 PM',
    email: 'joni@gmail.com',
    isRead: true,
    isHide: true,
  },
  {
    _id: 4,
    message: 'Awesome Work, Dude!',
    timestapm: '12:23 PM',
    email: 'akbarmuhammad833@gmail.com',
    isRead: true,
    isHide: true,
  },
  {
    _id: 5,
    message: 'Thank You bro!',
    timestapm: '12:23 PM',
    email: 'joni@gmail.com',
    isRead: true,
    isHide: false,
  },
]

interface State {
  user: {
    name: string
    email: string
    foto: string
  }
}

export default function RoomChat() {
  const params = useParams()
  const navigate = useNavigate()
  const { email } = useSelector((state: State) => state.user)
  const [messages, setMessages] = React.useState(fakeChat)

  return (
    <div className="bg-[#F6F6F6] w-full h-full">
      <div className="flex items-center justify-between px-[25px] h-24 bg-white">
        <div className="flex items-center gap-[20px]">
          <SlArrowLeft
            onClick={() => navigate(-1)}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="flex gap-[14px] items-center">
            <img
              src="https://picsum.photos/50/50?random=1"
              alt={params.name}
              className="rounded-full"
              width={50}
              height={50}
            />
            <div className="flex flex-col items-start gap-[3px]">
              <h1 className="font-semibold text-[15px] capitalize">
                {params.name}
              </h1>
              <p className="font-normal text-[12px] text-[#A0A0A0]">
                {params.name}@gmail.com
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
        {messages
          .sort((a, b) => a._id - b._id)
          .map((data, i) =>
            data.email === email ? (
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
                  {data.timestapm}{' '}
                </p>
              </div>
            )
          )}
      </ScrollToBottom>
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
        {data.timestapm}
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
