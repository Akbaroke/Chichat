import Skeleton from '@mui/material/Skeleton'

export default function ChatSkeleton(): JSX.Element {
  return (
    <div className="p-8 flex flex-col gap-5">
      <div className="ml-auto">
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            fontSize: '10px',
            borderRadius: '20px 20px 0 20px',
            background: '#eaeaea',
          }}
          width={150}
          height={52}
        />
      </div>
      <div>
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            borderRadius: '20px 20px 20px 0',
            background: '#eaeaea',
          }}
          width={180}
          height={52}
        />
      </div>
      <div className="ml-auto">
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            fontSize: '10px',
            borderRadius: '20px 20px 0 20px',
            background: '#eaeaea',
          }}
          width={200}
          height={100}
        />
      </div>
      <div>
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            borderRadius: '20px 20px 20px 0',
            background: '#eaeaea',
          }}
          width={200}
          height={52}
        />
      </div>
      <div className="ml-auto">
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            fontSize: '10px',
            borderRadius: '20px 20px 0 20px',
            background: '#eaeaea',
          }}
          width={120}
          height={52}
        />
      </div>
      <div className="ml-auto">
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            fontSize: '10px',
            borderRadius: '20px 20px 0 20px',
            background: '#eaeaea',
          }}
          width={150}
          height={52}
        />
      </div>
      <div>
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            borderRadius: '20px 20px 20px 0',
            background: '#eaeaea',
          }}
          width={200}
          height={100}
        />
      </div>
      <div>
        <Skeleton
          animation="wave"
          variant="rounded"
          sx={{
            borderRadius: '20px 20px 20px 0',
            background: '#eaeaea',
          }}
          width={200}
          height={52}
        />
      </div>
    </div>
  )
}
