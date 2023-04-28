import * as React from 'react'
import clsx from 'clsx'
import BackgroudChichat from '../components/BackgroudChichat'
import ChichatLabel from '../components/ChichatLabel'
import { FcGoogle } from 'react-icons/all'
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../redux/actions/user'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // function untuk login dengan google
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(res => {
        // get user
        const user = res.user
        dispatch(
          setUserInfo({
            name: user.displayName,
            email: user.email,
            foto: user.photoURL,
          })
        )
        navigate('/')
      })
      .catch(err => {
        console.error(err)
      })
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(
          setUserInfo({
            name: user.displayName,
            email: user.email,
            foto: user.photoURL,
          })
        )
        return navigate('/')
      }

      console.info('user belum login')
    })
  }, [dispatch, navigate])

  return (
    <div className="bg-white h-full flex flex-col pb-8">
      <div>
        <div className="px-9 pt-[50px] z-10 relative">
          <h1 className="inline-block max-w-[293px] font-semibold text-[35px]">
            Make your Communication More fun with
          </h1>
          <ChichatLabel />
        </div>
        <BackgroudChichat />
      </div>
      <div className="px-[37px] mt-auto">
        <button
          onClick={googleSignIn}
          className={clsx(
            'bg-white font-medium text-[18px] w-full h-[60px] rounded-full flex items-center justify-center gap-2 transition-all',
            'hover:shadow-lg hover:border-none',
            'border border-gray-200'
          )}>
          <FcGoogle className="w-6 h-6" />
          Continue With Google
        </button>
      </div>
    </div>
  )
}
