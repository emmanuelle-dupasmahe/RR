import { Skeleton } from '@mui/material';

const LegroupeSkeleton = () => {
  return (
    <div className="mt-[80px] bg-black">
      {/* Skeleton de l'En-tête */}
      <div className="text-center pt-[48px] pb-[20px] px-4 flex flex-col items-center">
        <Skeleton variant="text" width="300px" height={80} sx={{ bgcolor: '#222' }} />
        <Skeleton variant="text" width="200px" sx={{ bgcolor: '#111', mt: 2 }} />
        <Skeleton variant="text" width="80%" maxWidth="600px" sx={{ bgcolor: '#111', mt: 4 }} />
        
        {/* Skeleton de l'Annonce (le badge) */}
        <div className="mt-12 w-[300px] h-[60px] bg-[#111] rounded-lg border border-white/5 animate-pulse" />
      </div>

      {/* Grille des Membres */}
      <div className="max-w-[80rem] mx-auto px-[20px] py-[40px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex flex-col items-center">
              <Skeleton 
                variant="rectangular" 
                className="w-full aspect-[3/4] rounded-xl" 
                sx={{ bgcolor: '#1a1a1a' }} 
                animation="wave"
              />
              <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: '#222', mt: 3 }} />
              <Skeleton variant="text" width="40%" sx={{ bgcolor: '#111' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton de l'Histoire */}
      <div className="max-w-[900px] mx-auto px-6 py-16 border-t border-white/5">
        <div className="flex flex-col items-center">
          <Skeleton variant="text" width="50%" height={50} sx={{ bgcolor: '#222', mb: 8 }} />
          <div className="grid md:grid-cols-2 gap-12 w-full">
            <div>
              <Skeleton variant="text" count={4} sx={{ bgcolor: '#111' }} />
              <Skeleton variant="text" width="80%" sx={{ bgcolor: '#111' }} />
            </div>
            <div className="border-l-2 border-white/5 pl-6">
              <Skeleton variant="text" count={4} sx={{ bgcolor: '#111' }} />
              <Skeleton variant="text" width="60%" sx={{ bgcolor: '#111' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegroupeSkeleton;