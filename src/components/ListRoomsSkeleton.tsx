import ContentLoader from 'react-content-loader'

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
            className="flex justify-between items-center py-3 px-[25px] hover:bg-gray-100">
            <ContentLoader
              speed={2}
              width={300}
              height={80}
              backgroundColor={'#bcbcbc'}
              foregroundColor={'#f6f6f6'}>
              <circle cx="50" cy="40" r="30" />
              <rect x="100" y="23" rx="5" ry="5" width="80" height="8" />
              <rect x="100" y="48" rx="5" ry="5" width="150" height="8" />
            </ContentLoader>
          </div>
        ))}
    </div>
  )
}
