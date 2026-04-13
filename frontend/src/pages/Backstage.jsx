import React, { useState, useEffect } from 'react';

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
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            {/* Titre standard pour remplacer SectionTitle */}
            <div className="mb-12 border-l-4 border-red-600 pl-4">
                <h1 className="text-4xl font-black uppercase tracking-tighter">Backstage</h1>
                <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Espace Privé Groupe</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {morceaux && morceaux.length > 0 ? (
                    morceaux.map(m => (
                        <div key={m.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center hover:border-red-600/30 transition-colors">
                            
                            {/* Infos Morceau */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold uppercase tracking-tighter">{m.titre}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-black ${m.status === 'private' ? 'bg-red-600/20 text-red-600' : 'bg-green-500/20 text-green-500'}`}>
                                        {m.status === 'private' ? 'WORK IN PROGRESS' : 'PUBLIC'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">{m.detail || "Aucune note technique"}</p>
                                
                                {/* Lecteur Audio */}
                                <audio 
                                    src={m.url.startsWith('/uploads') ? `http://localhost:5000${m.url}` : m.url} 
                                    controls 
                                    className="w-full h-10 invert opacity-70 hover:opacity-100 transition-all"
                                />
                            </div>

                            {/* Section "À bosser" */}
                            <div className="w-full md:w-64 bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-[10px] font-black uppercase text-red-600 mb-2">Notes de répétition</h4>
                                <ul className="text-[11px] space-y-2 text-gray-400">
                                    <li>• Début : {m.start_time || 0}s</li>
                                    <li>• Fin : {m.end_time || 'Non définie'}</li>
                                    <li className="text-white/40 italic mt-2">Focus : Caler le tempo sur le refrain</li>
                                </ul>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center opacity-30 py-10">Aucun morceau enregistré dans le studio.</p>
                )}
            </div>
        </div>
    );
};

export default Backstage;