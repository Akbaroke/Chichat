import * as React from 'react'
import { signOut } from 'firebase/auth'
import {
  AiOutlineLogout,
  AiOutlinePlus,
  BsCheckAll,
  RiSearchLine,
  RxCross2,
} from 'react-icons/all'
import { auth } from '../config/firebase'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteUserInfo } from '../redux/actions/user'
import clsx from 'clsx'
import ModalStartChat from '../components/ModalStartChat'
import { showStartChat } from '../redux/actions/popup'

const fakeData = [
  {
    name: 'Joko',
    email: 'joko@gmail.com',
    profilePicture: `https://picsum.photos/60/60?random=${Math.floor(
      Math.random() * 10
    )}`,
    isMessageFromMe: true,
    messageDetails: {
      listMessage: ['Hallo', 'Hallo bro'],
      isRead: false,
      timestamp: '12:23 PM',
    },
  },
  {
    name: 'Doni',
    email: 'doni@gmail.com',
    profilePicture: `https://picsum.photos/60/60?random=${Math.floor(
      Math.random() * 10
    )}`,
    isMessageFromMe: false,
    messageDetails: {
      listMessage: ['Hallo Doni'],
      isRead: false,
      timestamp: '12:23 PM',
    },
  },
  {
    name: 'Ahmad',
    email: 'ahmad@gmail.com',
    profilePicture: `https://picsum.photos/60/60?random=${Math.floor(
      Math.random() * 10
    )}`,
    isMessageFromMe: false,
    messageDetails: {
      listMessage: ['Hallo Ahmad'],
      isRead: true,
      timestamp: '12:23 PM',
    },
  },
]

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isActiveSearch, setIsActiveSearch] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const signOutFromApp = () => {
    signOut(auth)
      .then(() => {
        dispatch(deleteUserInfo())
        navigate('/login')
      })
      .catch(err => {
        console.error(err)
      })
  }

  const filteredData = fakeData.filter(data =>
    data.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full h-full relative">
      <ModalStartChat />
      {!isActiveSearch ? (
        <div
          className={clsx(
            'flex justify-between items-center h-[70px] px-[25px] sticky top-0 bg-white shadow-lg shadow-white'
          )}>
          <h1 className="font-semibold text-[24px]">Chichat</h1>
          <div className="flex gap-2">
            <button
              className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-[#CACACA] hover:text-black transition-all"
              onClick={() => setIsActiveSearch(true)}>
              <RiSearchLine className="w-5 h-5" />
            </button>
            <button
              className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center text-[#CACACA] hover:text-black transition-all"
              onClick={signOutFromApp}>
              <AiOutlineLogout className="w-5 h-5" />
            </button>
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
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
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
      <div>
        {filteredData.map((data, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-3 cursor-pointer px-[25px] hover:bg-gray-100"
            onClick={() => navigate(`/${data.name}`)}>
            <div className="flex gap-[20px] items-center">
              <img
                src={data.profilePicture}
                alt={data.name}
                className="rounded-full"
                width={60}
                height={60}
              />
              <div className="flex flex-col items-start gap-[5px]">
                <h1 className="font-semibold text-[15px] capitalize">
                  {data.name}
                </h1>
                <p className="font-normal text-[12px] text-[#A0A0A0]">
                  {data.messageDetails.listMessage.at(-1)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-[5px]">
              <p className="font-normal text-[12px] text-[#A0A0A0]">
                {data.messageDetails.timestamp}
              </p>
              {data.isMessageFromMe ? (
                <div className="grid place-items-center w-5 h-5 rounded-full bg-[#D24140] text-white font-semibold text-[10px] py-.5">
                  {data.messageDetails.listMessage.length}
                </div>
              ) : (
                <BsCheckAll
                  className={clsx(
                    'w-5 h-5',
                    data.messageDetails.isRead
                      ? 'text-[#70C996]'
                      : 'text-[#C2C2C2]'
                  )}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className="grid place-items-center bg-blue-500 text-white rounded-full w-12 h-12 cursor-pointer shadow-md absolute left-1/2 transform -translate-x-1/2 bottom-10"
        onClick={() => dispatch(showStartChat())}>
        <AiOutlinePlus className="w-6 h-6" />
      </div>
    </div>
  )
}
