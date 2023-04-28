import { signOut } from 'firebase/auth'
import { AiOutlineLogout, RiSearchLine } from 'react-icons/all'
import { auth } from '../config/firebase'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteUserInfo } from '../redux/actions/user'

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  return (
    <div className="w-full h-full px-[25px]">
      <div className="flex justify-between items-center h-[85px]">
        <h1 className="font-semibold text-[24px]">Chichat</h1>
        <div className="flex gap-2">
          <button className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center">
            <RiSearchLine className="w-5 h-5 text-[#CACACA]" />
          </button>
          <button
            className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center"
            onClick={signOutFromApp}>
            <AiOutlineLogout className="w-5 h-5 text-[#CACACA]" />
          </button>
        </div>
      </div>
    </div>
  )
}
