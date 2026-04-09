import { useState, useEffect } from 'react';

export default function Groupe() {
    // 1. États pour stocker les données de la BDD
    const [membres, setMembres] = useState([]);
    const [groupTexts, setGroupTexts] = useState({
        group_slogan: '',
        group_announce: '',
        group_history_1: '',
        group_history_2: '',
        group_title_history: ''
    });

    // 2. Récupération des données au chargement
    useEffect(() => {
        // Récupérer les membres
        fetch('http://localhost:5000/api/membres')
            .then(res => res.json())
            .then(data => setMembres(data))
            .catch(err => console.error("Erreur membres:", err));

        // Récupérer les textes (Slogan, Annonce, etc.)
        fetch('http://localhost:5000/api/groupesettings')
            .then(res => res.json())
            .then(data => setGroupTexts(data))
            .catch(err => console.error("Erreur settings groupe:", err));
    }, []);

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-black text-white">

            <div className="text-center pt-[48px] pb-[20px] bg-gradient-to-b from-[#111] to-black px-4">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[900] uppercase mb-[4px] text-white leading-tight tracking-tighter">
                    Le Groupe
                </h1>

                <p className="text-primary font-black tracking-[5px] uppercase text-[0.7rem] md:text-xs mb-8">
                    Origin: Six-Fours-les-Plages // Established 2011
                </p>

                {/* SLOGAN DYNAMIQUE */}
                <div className="max-w-[800px] mx-auto">
                    <p className="text-[#9ca3af] text-[1.125rem] leading-relaxed italic">
                        {groupTexts.group_slogan}
                    </p>
                </div>

                {/* ANNONCE DYNAMIQUE */}
                {groupTexts.group_announce && (
                    <div className="mt-12 inline-block p-[1px] rounded-lg bg-gradient-to-r from-primary via-white/20 to-primary shadow-[0_10px_40px_rgba(227,24,31,0.15)]">
                        <div className="bg-black px-10 py-5 rounded-lg">
                            <p className="text-white font-black tracking-[4px] uppercase text-sm md:text-lg">
                                {groupTexts.group_announce.includes("Tribute") ? (
                                    <>
                                        {groupTexts.group_announce.split(':')[0]} :
                                        <span className="text-primary animate-pulse">
                                            {groupTexts.group_announce.split(':')[1]}
                                        </span>
                                    </>
                                ) : groupTexts.group_announce}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* GRILLE DES MEMBRES DYNAMIQUE */}
            <div className="max-w-[80rem] mx-auto px-[20px] py-[40px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]">
                    {membres.map((m) => (
                        <div key={m.id} className="group flex flex-col items-center">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-[#111] transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(227,24,31,0.3)]">
                                <img
                                    src={m.photo_url || "/images/default-member.png"}
                                    alt={m.nom}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                    <span className="text-white font-black text-2xl tracking-widest">{m.nom}</span>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-primary text-[1.2rem] font-black tracking-[4px] uppercase mb-1">{m.instrument}</p>
                                <h3 className="text-white text-[0.8rem] font-bold uppercase tracking-tighter opacity-80">{m.nom}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* HISTOIRE DYNAMIQUE */}
            <div className="max-w-[900px] mx-auto px-6 py-16 border-t border-white/5">
                <div className="text-center">
                    <h2 className="text-white text-2xl md:text-3xl font-black uppercase mb-10 tracking-tight">
                        {/* On vérifie si group_title_history contient une virgule pour le style bicolore */}
                        {groupTexts.group_title_history && groupTexts.group_title_history.includes(',') ? (
                            <>
                                {groupTexts.group_title_history.split(',')[0]},
                                <span className="text-primary">
                                    {groupTexts.group_title_history.split(',')[1]}
                                </span>
                            </>
                        ) : (
                            groupTexts.group_title_history
                        )}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div>
                            <p className="text-[#9ca3af] leading-relaxed text-lg font-medium">
                                {groupTexts.group_history_1}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#9ca3af] leading-relaxed text-lg font-medium border-l-2 border-primary/30 pl-6">
                                {groupTexts.group_history_2}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RÉPERTOIRE  */}
            <div className="bg-[#0a0a0a] py-16 px-6">
                <div className="max-w-[1100px] mx-auto text-center">
                    <h3 className="text-white font-black uppercase tracking-[6px] text-[0.6rem] mb-8 opacity-30 italic">Expanded Repertoire</h3>
                    <p className="text-[#685c5c] text-[9px] md:text-[11px] leading-[3] uppercase tracking-[4px] font-bold">
                        U2 • Muse • Téléphone • The Police • Genesis • Rita Mitsouko • Eminem • Axel Bauer • Bruno Mars • Harry Styles • Santana • BB brunes • Queen • The supermen lovers • AC/DC • Kaleo • Trust • DNCE • Lenny Kravitz • Zucchero • Bob Marley • Mathieu Chedid • Rare Earth • Junkie XL • Nickelback • The Killers • Rage Against The Machine...
                    </p>
                </div>
            </div>
        </div>
    );
}