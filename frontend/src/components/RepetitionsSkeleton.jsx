
const RepetitionsSkeleton = () => {
    return (
        <div className="max-w-[56rem] mx-auto px-[20px] py-[40px] flex flex-col gap-[16px] w-full">
            {[1, 2, 3, 4, 5].map((n) => (
                <div
                    key={n}
                    className="flex flex-col md:flex-row items-center gap-[24px] p-[20px] rounded-[1rem] border border-white/5 bg-[#0a0a0a] w-full"
                >
                    {/* Section Gauche : Numéro + Textes */}
                    <div className="flex items-center gap-[16px] flex-1 w-full">
                        {/* Carré Numéro */}
                        <div className="w-[40px] h-[40px] bg-[#222] rounded-[4px] shrink-0 animate-pulse" />
                        
                        {/* Bloc Texte - On utilise des div pour forcer l'étalement */}
                        <div className="flex flex-col flex-1 gap-3">
                            <div className="h-[20px] w-[80%] bg-[#222] rounded animate-pulse" />
                            <div className="h-[14px] w-[40%] bg-[#111] rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Section Droite : Lecteur Audio */}
                    <div className="w-full md:max-w-[350px] shrink-0">
                        <div className="h-[38px] w-full bg-[#1a1a1a] rounded-full border border-white/5 shadow-[0_0_10px_rgba(227,24,31,0.1)] animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RepetitionsSkeleton;