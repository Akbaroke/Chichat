import clsx from 'clsx'

interface Props {
  classNameOverride?: string
}

export default function ChichatLabel({
  classNameOverride = 'bg-blue-500 ',
}: Props) {
  return (
    <div
      className={clsx(
        'w-max text-white font-semibold text-[26px] rounded-full py-2 px-4',
        classNameOverride
      )}>
      Chichat
    </div>
  )
}
