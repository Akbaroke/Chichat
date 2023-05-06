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
import { auth, firestore } from '../config/firebase'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../redux/actions/user'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

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
        updateUserProfile(user.uid, user.displayName, user.email, user.photoURL)
        dispatch(
          setUserInfo({
            id: user.uid,
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
    <div className="bg-white h-full flex flex-col">
      <div>
        <div className="px-6 sm:px-9 pt-6 sm:pt-[50px] z-10 relative">
          <h1 className="inline-block max-w-[293px] font-semibold text-[30px] sm:text-[35px] mb-4">
            Make your Communication More fun with
          </h1>
          <ChichatLabel />
        </div>
        <BackgroudChichat />
      </div>
      <div className="px-[37px] mt-auto sticky bottom-8">
        <button
          onClick={googleSignIn}
          className={clsx(
            'bg-white w-full h-[60px] rounded-full flex items-center justify-center gap-2 transition-all outline outline-1 outline-gray-300 shadow-lg px-4',
            'hover:shadow-none hover:border-none'
          )}>
          <FcGoogle className="w-6 h-6" />
          <p className="font-medium text-[16px] sm:text-[18px] max-w-[100] truncate pt-[2px]">
            Continue With Google
          </p>
        </button>
      </div>
    </div>
  )
}
