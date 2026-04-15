import { useState, useEffect } from 'react';
import LegroupeSkeleton from '../components/LegroupeSkeleton';
import { memberService, settingsService } from '../services/api';

export default function Groupe() {
    const [membres, setMembres] = useState([]);
    const [groupTexts, setGroupTexts] = useState({
        group_slogan: '',
        group_announce: '',
        group_history_1: '',
        group_history_2: '',
        group_title_history: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            memberService.getAll(),
            settingsService.getGroupSettings()
        ])
            .then(([membresData, textsData]) => {
                setMembres(membresData);
                setGroupTexts(textsData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement groupe:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <LegroupeSkeleton />;

    return (
        /* Le fond devient blanc en mode clair, noir en mode dark */
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">

            {/* Header avec dégradé adaptable */}
            <div className="text-center pt-[48px] pb-[20px] bg-gradient-to-b from-gray-100 to-white dark:from-[#111] dark:to-black px-4 transition-colors duration-300">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    Le Groupe
                </h1>

                <p className="text-primary font-black tracking-[5px] uppercase text-[0.7rem] md:text-xs mb-8">
                    Origin: Six-Fours-les-Plages // Established 2011
                </p>

                {/* SLOGAN DYNAMIQUE */}
                <div className="max-w-[800px] mx-auto">
                    <p className="text-gray-600 dark:text-[#9ca3af] text-[1.125rem] leading-relaxed italic transition-colors">
                        {groupTexts.group_slogan}
                    </p>
                </div>

                {/* ANNONCE DYNAMIQUE */}
                {groupTexts.group_announce && (
                    <div className="mt-12 inline-block p-[1px] rounded-lg bg-gradient-to-r from-primary via-gray-300 dark:via-white/20 to-primary shadow-[0_10px_40px_rgba(227,24,31,0.15)]">
                        <div className="bg-white dark:bg-black px-10 py-5 rounded-lg transition-colors">
                            <p className="text-black dark:text-white font-black tracking-[4px] uppercase text-sm md:text-lg">
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

            {/* GRILLE DES MEMBRES */}
            <div className="max-w-[80rem] mx-auto px-[20px] py-[40px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px]">
                    {membres.map((m) => (
                        <div key={m.id} className="group flex flex-col items-center">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#111] transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(227,24,31,0.3)]">
                                <img
                                    src={m.photo_url || "/images/default-member.png"}
                                    alt={m.nom}
                                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                    <span className="text-black dark:text-white font-black text-2xl tracking-widest">{m.nom}</span>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-primary text-[1.2rem] font-black tracking-[4px] uppercase mb-1">{m.instrument}</p>
                                <h3 className="text-black dark:text-white text-[0.8rem] font-bold uppercase tracking-tighter opacity-80 transition-colors">{m.nom}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* HISTOIRE DYNAMIQUE */}
            <div className="max-w-[1000px] mx-auto px-6 py-16 border-t border-black/5 dark:border-white/5 transition-colors">
                <div className="text-center">
                    <h2 className="text-black dark:text-white text-2xl md:text-4xl font-[300] uppercase mb-12 tracking-[0.1em] inline-block transform scale-x-[0.90] origin-center transition-colors">
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

                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 text-left">
                        <div className="flex-1 md:pr-10">
                            <p className="text-gray-600 dark:text-[#9ca3af] leading-relaxed text-lg font-medium text-left md:text-justify transition-colors">
                                {groupTexts.group_history_1}
                            </p>
                        </div>

                        <div className="flex-1 md:pl-10 border-t md:border-t-0 md:border-l-2 border-primary/30 mt-8 md:mt-0">
                            <p className="text-gray-600 dark:text-[#9ca3af] leading-relaxed text-lg font-medium text-left md:text-justify transition-colors">
                                {groupTexts.group_history_2}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RÉPERTOIRE */}
            <div className="bg-gray-50 dark:bg-[#0a0a0a] py-16 px-6 transition-colors">
                <div className="max-w-[1100px] mx-auto text-center">
                    <h3 className="text-[#888] dark:text-[#685c5c] font-black uppercase tracking-[8px] text-[0.85rem] mb-6 transition-colors">
                        Expanded Repertoire
                    </h3>
                    <p className="text-gray-400 dark:text-[#888] text-[10px] md:text-[12px] leading-[2.5] uppercase tracking-[3px] font-medium transition-colors">
                        U2 • Muse • Téléphone • The Police • Genesis • Les Rita Mitsouko • Eminem • Axel Bauer • Bruno Mars • Harry Styles • Santana • BB Brunes • Queen • The Supermen Lovers • AC/DC • Kaleo • Trust • DNCE • Lenny Kravitz • Zucchero • Bob Marley • -M- • Rare Earth • Junkie XL • Nickelback • The Killers • Rage Against The Machine...
                    </p>
                </div>
            </div>
        </div>
    );
}