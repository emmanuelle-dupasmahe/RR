const LegroupeSkeleton = () => {
    return (
        <div className="mt-[80px] bg-black min-h-screen">
            {/* 1. Header Skeleton */}
            <div className="text-center pt-[48px] pb-[20px] px-4 flex flex-col items-center">
                <div className="h-[60px] w-[300px] bg-[#222] rounded mb-4 animate-pulse" />
                <div className="h-[20px] w-[200px] bg-[#111] rounded mb-8 animate-pulse" />
                <div className="h-[24px] w-[80%] max-w-[600px] bg-[#111] rounded animate-pulse" />
                
                {/* Badge Annonce */}
                <div className="mt-12 w-[280px] h-[50px] bg-[#111] rounded-lg border border-white/5 animate-pulse" />
            </div>

            {/* 2. Grille des Membres - LE PLUS IMPORTANT */}
            <div className="max-w-[80rem] mx-auto px-[20px] py-[40px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex flex-col items-center w-full">
                            {/* Le rectangle de la photo : aspect-[3/4] est la clé */}
                            <div className="w-full aspect-[3/4] bg-[#111] rounded-xl border border-white/5 animate-pulse shrink-0" />
                            
                            {/* Textes sous la photo */}
                            <div className="mt-6 flex flex-col items-center gap-2 w-full">
                                <div className="h-[20px] w-[60%] bg-[#222] rounded animate-pulse" />
                                <div className="h-[14px] w-[40%] bg-[#111] rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Histoire Skeleton */}
            <div className="max-w-[900px] mx-auto px-6 py-16 border-t border-white/5">
                <div className="flex flex-col items-center gap-12">
                    <div className="h-[40px] w-[50%] bg-[#222] rounded animate-pulse" />
                    
                    <div className="grid md:grid-cols-2 gap-12 w-full">
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[16px] w-full bg-[#111] rounded animate-pulse" />
                            ))}
                        </div>
                        <div className="flex flex-col gap-3 border-l-2 border-white/5 pl-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[16px] w-full bg-[#111] rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegroupeSkeleton;