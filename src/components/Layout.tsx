import clsx from 'clsx'

export default function Layout({ children }) {
  return (
    <div
      className={clsx(
        'w-screen h-screen overflow-hidden',
        'sm:w-[430px] sm:h-[932px] sm:m-auto sm:mt-5 sm:rounded-[30px] sm:shadow-2xl sm:border-gray-200 sm:border'
      )}>
      {children}
    </div>
  )
}
