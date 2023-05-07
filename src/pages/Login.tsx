import * as React from 'react'
import clsx from 'clsx'
import { AiOutlineInfoCircle, FcGoogle } from 'react-icons/all'
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, firestore } from '../config/firebase'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../redux/actions/user'
import { Link, useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import LOGO from '../assets/logo.png'
import LoadingAnimation from '../components/LoadingAnimation'
import { Tooltip } from '@mui/material'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(false)

  // function untuk login dengan google
  const googleSignIn = () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(res => {
        // get user
        const user = res.user
        updateUserProfile(user.uid, user.displayName, user.email, user.photoURL)
        dispatch(
          setUserInfo({
            id: user.uid,
            name: user.displayName,
            email: user.email,
            foto: user.photoURL,
          })
        )
        setIsLoading(false)
        navigate('/')
      })
      .catch(err => {
        setIsLoading(false)
        console.error(err)
      })
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(
          setUserInfo({
            id: user.uid,
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

  // add new users
  const updateUserProfile = async (id, name, email, foto) => {
    const usersRef = doc(firestore, 'users', id)
    const data = await getDoc(usersRef)
    if (data.data()) {
      await updateDoc(usersRef, {
        ...data.data(),
        name: name,
        email: email,
        imgProfile: foto,
      })
        .then(() => {
          console.info('update success')
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      await setDoc(usersRef, {
        name: name,
        email: email,
        imgProfile: foto,
        rooms: [],
      })
        .then(() => {
          console.info('create success')
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  return (
    <div className="bg-[#2D61A6] w-full h-full flex flex-col justify-center items-center gap-10 relative">
      <Tooltip title="about" arrow>
        <Link
          to="/about"
          className="absolute top-7 right-7 text-[30px] text-white">
          <AiOutlineInfoCircle />
        </Link>
      </Tooltip>
      <img src={LOGO} alt="chichat" width={240} className="drop-shadow-lg" />
      {isLoading ? (
        <div className="py-4">
          <LoadingAnimation />
        </div>
      ) : (
        <button
          disabled={isLoading ? true : false}
          onClick={googleSignIn}
          className={clsx(
            'bg-white py-3 px-4 rounded-lg border border-gray-300 flex justify-center items-center gap-2 max-w-[280px] transition-all w-full'
          )}>
          <FcGoogle className="w-6 h-6" />
          <p className="font-medium text-[14px] max-w-[100] truncate pt-[2px]">
            Continue With Google
          </p>
        </button>
      )}
    </div>
  )
}
