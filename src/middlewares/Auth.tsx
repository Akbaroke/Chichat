import { onAuthStateChanged } from 'firebase/auth'
import * as React from 'react'
import { auth } from '../config/firebase'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../redux/actions/user'
import Login from '../pages/Login'

export default function Auth({ children }) {
  const dispatch = useDispatch()
  const [isAuth, setIsAuth] = React.useState(false)

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
        return setIsAuth(true)
      }
    })
  }, [children, dispatch])

  return isAuth ? children : <Login />
}
