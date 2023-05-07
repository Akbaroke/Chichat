import Skeleton from '@mui/material/Skeleton'

interface Props {
  cards: number
}

export default function ListRoomsSkeleton({ cards }: Props): JSX.Element {
  return (
    <div>
      {Array(cards)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex gap-4 items-center py-3 px-[25px] hover:bg-gray-100">
            <Skeleton
              animation="wave"
              variant="circular"
              width={60}
              height={60}
            />
            <div className="flex flex-col gap-2">
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '10px' }}
                width={150}
              />
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '10px' }}
                width={100}
              />
            </div>
          </div>
        ))}
    </div>
  )
}
