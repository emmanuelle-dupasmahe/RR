import React, { useState, useEffect } from 'react';
import WavePlayer from '../components/WavePlayer';

const Backstage = () => {
    const [morceaux, setMorceaux] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchBackstageData();
    }, []);

    const fetchBackstageData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/repetitions?limit=50', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMorceaux(data.repetitions);
            }
        } catch (err) {
            console.error("Erreur Backstage:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-red-600 font-bold uppercase tracking-widest">Chargement du studio...</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* HEADER DE LA PAGE */}
            <div className="text-center pt-[100px] pb-[40px] bg-gradient-to-b from-[#111] to-black px-4 mb-8">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-white inline-block">
                    Backstage
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-[0.7rem] md:text-xs mb-4">
                    Espace Privé // Accès réservé aux membres
                </p>
            </div>

            {/* CONTENU DES MORCEAUX */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 gap-6">
                    {morceaux && morceaux.length > 0 ? (
                        morceaux
                            .filter(m => m.status === 'private')
                            .map(m => {
                                const markers = m.markers ? JSON.parse(m.markers) : [];
                                
                                return (
                                    <div key={m.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col lg:flex-row gap-6 items-start hover:border-red-600/30 transition-colors overflow-hidden">

                                        {/* COLONNE GAUCHE : INFOS + LECTEUR 
                                            L'ajout de 'min-w-0' est CRUCIAL pour que le zoom ne casse pas le layout
                                        */}
                                        <div className="flex-1 w-full min-w-0"> 
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold uppercase tracking-tighter truncate">{m.titre}</h3>
                                                <span className="text-[10px] px-2 py-0.5 rounded font-black bg-red-600/20 text-red-600 shrink-0">
                                                    WORK IN PROGRESS
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4 truncate">{m.detail || "Aucune note technique"}</p>

                                            <div className="mt-4 bg-black/20 rounded-xl overflow-hidden">
                                                <WavePlayer
                                                    url={m.url.startsWith('/uploads') ? `http://localhost:5000${m.url}` : m.url}
                                                    startTime={m.start_time}
                                                    endTime={m.end_time}
                                                    id={`wave-${m.id}`}
                                                />
                                            </div>
                                        </div>

                                        {/* COLONNE DROITE : MARKERS */}
                                        <div className="w-full lg:w-80 bg-white/5 p-4 rounded-xl border border-white/5 self-stretch shrink-0">
                                            <h4 className="text-[10px] font-black uppercase text-red-600 mb-3 tracking-widest">Markers</h4>
                                            
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                                {markers.length > 0 ? markers.map((marker, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            window.dispatchEvent(new CustomEvent(`jump-to-${m.id}`, { detail: marker.time }));
                                                        }}
                                                        className="w-full text-left bg-black/40 hover:bg-red-600/10 border border-white/5 hover:border-red-600/30 p-3 rounded-lg transition-all group flex gap-3 items-center"
                                                    >
                                                        <span className="text-red-600 font-black text-[10px] bg-red-600/10 px-2 py-1 rounded">
                                                            {Math.floor(marker.time / 60)}:{(marker.time % 60).toString().padStart(2, '0')}
                                                        </span>
                                                        <span className="text-gray-300 text-[11px] leading-tight group-hover:text-white flex-1 truncate">
                                                            {marker.label}
                                                        </span>
                                                    </button>
                                                )) : (
                                                    <div className="text-[11px] text-white/20 italic p-2 border border-dashed border-white/10 rounded">
                                                        Aucun marqueur.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <p className="text-center opacity-30 py-10">Aucun morceau enregistré dans le studio.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Backstage;