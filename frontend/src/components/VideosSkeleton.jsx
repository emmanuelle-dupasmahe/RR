import { Skeleton } from '@mui/material';

const VideosSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[32px]">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="bg-[#0a0a0a] rounded-[1.2rem] border border-white/5 p-4">
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ bgcolor: '#1a1a1a', borderRadius: '0.8rem' }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            sx={{ bgcolor: '#222', mt: 2, fontSize: '1.5rem', width: '70%' }}
          />
          <Skeleton
            variant="text"
            sx={{ bgcolor: '#111', width: '90%' }}
          />
        </div>
      ))}
    </div>
  );
};

export default VideosSkeleton;