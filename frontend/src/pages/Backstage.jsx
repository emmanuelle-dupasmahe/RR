import React, { useState, useEffect } from 'react';
import WavePlayer from '../components/WavePlayer';
import { repetitionService, BASE_URL } from '../services/api';

const Backstage = () => {
    const [morceaux, setMorceaux] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBackstageData();
    }, []);

    const fetchBackstageData = async () => {
        try {
            const data = await repetitionService.getAll(1, 50);
            setMorceaux(data.repetitions);
        } catch (err) {
            console.error("Erreur Backstage:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">

                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">Initialisation Studio...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
            {/* HEADER DE LA PAGE */}
            <div className="text-center pt-[120px] pb-[60px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black px-4 border-b border-gray-100 dark:border-none">
                <h1 className="text-[3rem] md:text-[4rem] font-[300] uppercase m-0 leading-[1] tracking-[0.1em] text-black dark:text-white inline-block">
                    Backstage
                </h1>
                <div className="mt-4">

                    <p className="text-primary font-black tracking-[5px] uppercase text-[0.7rem] md:text-xs">
                        Espace Privé // Membres Uniquement
                    </p>
                </div>
            </div>

            {/* CONTENU DES MORCEAUX */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 gap-8">
                    {morceaux && morceaux.length > 0 ? (
                        morceaux
                            .filter(m => m.status === 'private')
                            .map(m => {
                                const markers = m.markers ? JSON.parse(m.markers) : [];

                                return (

                                    <div key={m.id} className="group relative bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 p-6 rounded-2xl flex flex-col lg:flex-row gap-8 items-start hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-2xl">

                                        {/* COLONNE GAUCHE : INFOS + LECTEUR */}
                                        <div className="flex-1 w-full min-w-0 text-black dark:text-white">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">

                                                <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">
                                                    {m.titre}
                                                </h3>

                                                <span className="text-[9px] px-2 py-1 rounded-sm font-black bg-primary text-white tracking-widest uppercase">
                                                    WIP
                                                </span>
                                            </div>

                                            <p className="text-gray-500 dark:text-[#666] text-sm mb-6 font-medium italic border-l-2 border-gray-200 dark:border-primary/20 pl-4">
                                                {m.detail || "Aucune note technique pour cette session."}
                                            </p>

                                            <div className="mt-4 p-2 bg-gray-200 dark:bg-black rounded-xl overflow-hidden shadow-inner [&_.text-white]:text-black dark:[&_.text-white]:text-white">
                                                <WavePlayer
                                                    url={m.url.startsWith('/uploads') ? `${BASE_URL}${m.url}` : m.url}
                                                    startTime={m.start_time}
                                                    endTime={m.end_time}
                                                    id={`wave-${m.id}`}
                                                />
                                            </div>
                                        </div>

                                        {/* COLONNE DROITE : MARKERS */}
                                        <div className="w-full lg:w-80 bg-white dark:bg-white/5 p-5 rounded-xl border border-gray-200 dark:border-white/5 self-stretch shrink-0 shadow-sm">
                                            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-2">

                                                <h4 className="text-[10px] font-black uppercase text-primary tracking-widest">Markers</h4>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase">{markers.length} points</span>
                                            </div>

                                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                                {markers.length > 0 ? markers.map((marker, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            window.dispatchEvent(new CustomEvent(`jump-to-${m.id}`, { detail: marker.time }));
                                                        }}

                                                        className="w-full text-left bg-gray-50 dark:bg-black/40 hover:bg-primary dark:hover:bg-primary/10 border border-gray-200 dark:border-white/5 hover:border-primary p-3 rounded-lg transition-all group/item flex gap-3 items-center"
                                                    >

                                                        <span className="text-white dark:text-primary font-black text-[10px] bg-primary dark:bg-primary/10 px-2 py-1 rounded group-hover/item:bg-white group-hover/item:text-primary transition-colors">
                                                            {Math.floor(marker.time / 60)}:{(marker.time % 60).toString().padStart(2, '0')}
                                                        </span>
                                                        <span className="text-gray-600 dark:text-gray-300 text-[11px] font-bold leading-tight group-hover/item:text-white flex-1 truncate uppercase tracking-tight">
                                                            {marker.label}
                                                        </span>
                                                    </button>
                                                )) : (
                                                    <div className="text-[11px] text-gray-400 dark:text-white/20 italic p-4 border border-dashed border-gray-200 dark:border-white/10 rounded text-center">
                                                        Aucun marqueur défini.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="py-32 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-3xl">
                            <p className="text-gray-400 dark:text-[#222] uppercase font-black tracking-[10px] text-xl">Studio vide.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Backstage;