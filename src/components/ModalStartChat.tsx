import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { hideStartChat } from '../redux/actions/popup'

interface State {
  popup: {
    isModalStartChat: boolean
  }
}

export default function ModalStartChat() {
  const dispatch = useDispatch()
  const { isModalStartChat } = useSelector((state: State) => state.popup)

  return (
    <Transition appear show={isModalStartChat} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[10px] bg-[#F6F6F6] text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center bg-white px-[28px] h-[70px]">
                  <h1 className="font-semibold text-[20px]">Start Chat</h1>
                  <button onClick={() => dispatch(hideStartChat())}>
                    <RxCross2 />
                  </button>
                </div>
                <div className="flex flex-col gap-[13px] mt-5 px-[28px]">
                  <label htmlFor="email" className="text-[14px]">
                    Destination Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Input here"
                    className="bg-white placeholder:text-[14px] placeholder:text-[#bcbcbc] rounded-[10px] px-7 h-[50px]"
                  />
                </div>
                <button
                  className="w-[200px] h-[40px] bg-blue-500 rounded-[50px] text-[14px] text-white font-semibold grid place-items-center m-auto my-7"
                  onClick={() => dispatch(hideStartChat())}>
                  Continue
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
