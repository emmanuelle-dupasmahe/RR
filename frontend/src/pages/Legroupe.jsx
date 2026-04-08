const members = [
    { name: "ERIC", role: "BATTERIE", img: "/images/eric.png" },
    { name: "JEAN-MARC", role: "CHANT & GUITARE", img: "/images/JM.png" },
    { name: "ROMAIN", role: "GUITARE", img: "/images/romain.png" },
    { name: "MARTIAL", role: "BASSE", img: "/images/martiou.png" },
];

export default function Groupe() {
    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-black text-white">
            {/* EN-TÊTE SANS BORDURE POUR FUSIONNER AVEC LA GRILLE */}
            <div className="text-center pt-[48px] pb-[20px] bg-gradient-to-b from-[#111] to-black px-4">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[900] uppercase mb-[4px] text-white leading-tight tracking-tighter">
                    Le Groupe
                </h1>
                
                <p className="text-primary font-black tracking-[5px] uppercase text-[0.7rem] md:text-xs mb-8">
                    Origin: Six-Fours-les-Plages // Established 2011
                </p>

                <div className="max-w-[800px] mx-auto">
                    <p className="text-[#9ca3af] text-[1.125rem] leading-relaxed italic">
                        Plus qu'un simple groupe de reprises, <span className="text-white font-bold not-italic">Réservoir Rock</span> puise son énergie dans un répertoire éclectique et puissant.
                    </p>
                </div>

                {/* ANNONCE TRIBUTE - MARGE RÉDUITE POUR REMONTER LA GRILLE */}
                <div className="mt-12 inline-block p-[1px] rounded-lg bg-gradient-to-r from-primary via-white/20 to-primary shadow-[0_10px_40px_rgba(227,24,31,0.15)]">
                    <div className="bg-black px-10 py-5 rounded-lg">
                        <p className="text-white font-black tracking-[4px] uppercase text-sm md:text-lg">
                            En préparation : <span className="text-primary animate-pulse">Tribute U2 & MUSE</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* GRILLE DES MEMBRES - REMONTÉE VIA PY RÉDUIT */}
            <div className="max-w-[80rem] mx-auto px-[20px] py-[40px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]">
                    {members.map((member) => (
                        <div key={member.name} className="group flex flex-col items-center">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-[#111] transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(227,24,31,0.3)]">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                    <span className="text-white font-black text-2xl tracking-widest">{member.name}</span>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-primary text-[0.8rem] font-black tracking-[4px] uppercase mb-1">{member.role}</p>
                                <h3 className="text-white text-[1.5rem] font-bold uppercase tracking-tighter opacity-80">{member.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION HISTOIRE & PHILOSOPHIE */}
            <div className="max-w-[900px] mx-auto px-6 py-20 border-t border-white/5">
                <div className="text-center">
                    <h2 className="text-white text-2xl md:text-3xl font-black uppercase mb-10 tracking-tight">
                        L'ÉNERGIE BRUTE, <span className="text-primary">L'EXIGENCE DU SON</span>
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div>
                            <p className="text-[#9ca3af] leading-relaxed text-lg font-medium">
                                Composé de <span className="text-white">Jean-Marc, Martial, Romain et Eric</span>, le groupe a forgé son identité sur une obsession : la précision sonore. Ils allient le pur plaisir du jeu à des prestations de qualité professionnelle.
                            </p>
                        </div>
                        <div>
                            <p className="text-[#9ca3af] leading-relaxed text-lg font-medium border-l-2 border-primary/30 pl-6">
                                Une importance capitale est accordée à la technique et au matériel de pointe, transformant chaque scène en un spectacle soigné et immersif.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RÉPERTOIRE INFLUENCES */}
            <div className="bg-[#0a0a0a] border-t border-white/5 py-24 px-6">
                <div className="max-w-[1100px] mx-auto text-center">
                    <h3 className="text-white font-black uppercase tracking-[6px] text-[0.6rem] mb-12 opacity-30 italic">Expanded Repertoire & Influences</h3>
                    <p className="text-[#685c5c] text-[9px] md:text-[11px] leading-[3] uppercase tracking-[4px] font-bold">
                        U2 • Muse • Téléphone • Police • Genesis • Rita Mitsouko • Eminem • Axel Bauer • Bruno Mars • Harry Styles • Santana • BB brunes • Queen • The supermen lovers • AC/DC • Kaleo • Trust • DNCE • Lenny Kravitz • Zucchero • Bob Marley...
                    </p>
                </div>
            </div>
        </div>
    );
}