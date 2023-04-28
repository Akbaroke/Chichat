import clsx from 'clsx'

export default function Layout({ children }) {
  return (
    <div
      className={clsx(
        'w-screen h-screen overflow-x-hidden',
        'sm:w-[430px] sm:h-[932px] sm:m-auto sm:mt-5 sm:rounded-[30px] sm:shadow-xl'
      )}>
      {children}
    </div>
  )
}
