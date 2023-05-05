import clsx from 'clsx'
import { useLocation } from 'react-router-dom'
import ScrollToBottom from 'react-scroll-to-bottom'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const isChat = pathname === '/chat'
  console.info(isChat)

  const containerClassName = clsx(
    'w-screen h-screen overflow-x-hidden',
    'sm:w-[430px] sm:h-[932px] sm:m-auto sm:mt-5 sm:rounded-[30px] sm:shadow-xl sm:border'
  )

  return (
    <ScrollToBottom
      mode={isChat ? 'bottom' : 'top'}
      className={containerClassName}>
      {children}
    </ScrollToBottom>
  )
}
