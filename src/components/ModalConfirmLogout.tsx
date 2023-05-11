import { Dialog, Transition } from '@headlessui/react'
import { RxCross2 } from 'react-icons/all'
import { useDispatch, useSelector } from 'react-redux'
import { Fragment } from 'react'
import { hideConfirmLogout } from '../redux/actions/popup'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigate } from 'react-router-dom'
import { deleteUserInfo } from '../redux/actions/user'

interface State {
  popup: {
    isModalConfirmLogout: boolean
  }
}

export default function ModalConfirmLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isModalConfirmLogout } = useSelector((state: State) => state.popup)

  const signOutFromApp = async () => {
    try {
      await signOut(auth)
      navigate('/login')
      dispatch(deleteUserInfo())
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(hideConfirmLogout())
    }
  }

  return (
    <Transition appear show={isModalConfirmLogout} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(hideConfirmLogout())}>
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
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full transform overflow-hidden rounded-[10px] bg-[#F6F6F6] text-left align-middle shadow-xl transition-all max-w-[350px]">
                <div className="flex justify-between items-center bg-white px-[28px] h-[70px]">
                  <h1 className="font-semibold text-[20px]">Logout Confirm</h1>
                  <button onClick={() => dispatch(hideConfirmLogout())}>
                    <RxCross2 />
                  </button>
                </div>
                <div className="flex flex-col gap-[13px] mt-5 px-[28px] py-4 relative">
                  Are you sure you want to logout ?
                </div>
                <div className="flex gap-5 m-auto my-7 w-max">
                  <button
                    className="w-[100px] h-[40px] bg-gray-400 rounded-lg text-[14px] text-white font-semibold grid place-items-center"
                    onClick={() => dispatch(hideConfirmLogout())}>
                    Cancel
                  </button>
                  <button
                    className="w-[100px] h-[40px] bg-red-600 rounded-lg text-[14px] text-white font-semibold grid place-items-center"
                    onClick={signOutFromApp}>
                    Logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
