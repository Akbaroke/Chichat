import clsx from 'clsx'

export default function Layout({ children }) {
  const containerClassName = clsx(
    'w-screen h-screen overflow-hidden',
    'sm:w-[430px] sm:h-[932px] sm:m-auto sm:mt-5 sm:rounded-[30px] sm:shadow-xl sm:border'
  )

  return <div className={containerClassName}>{children}</div>
}
