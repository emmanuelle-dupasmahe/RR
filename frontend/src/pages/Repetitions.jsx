import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import RepetitionsSkeleton from '../components/RepetitionsSkeleton';

function Repetitions() {
    const [morceaux, setMorceaux] = useState([]);
    const [loading, setLoading] = useState(true);

    const { isAdmin } = useContext(AuthContext);

    const fetchMorceaux = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/repetitions');
            const data = await res.json();
            setMorceaux(Array.isArray(data) ? data : data.repetitions || []);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des morceaux :", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce morceau ?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/repetitions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setMorceaux(morceaux.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

    useEffect(() => {
        fetchMorceaux();
    }, []);

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-black">
            {/* EN-TÊTE */}
            <div className="text-center py-[48px]  bg-gradient-to-b from-[#111] to-black">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-white inline-block">
                    Studio Répétitions
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    Enregistrements bruts
                </p>


                {/* 4. BOUTON AJOUTER (Visible uniquement pour les 2 admins) */}
                {isAdmin && (
                    <button className="mt-8 bg-primary text-white px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition-all">
                        + Ajouter un enregistrement
                    </button>
                )}
            </div>

            {/* LISTE DES MORCEAUX */}
            <div className="max-w-[56rem] mx-auto px-[20px] py-[40px] flex flex-col gap-[16px]">
                {loading ? (
                    <RepetitionsSkeleton />
                ) : morceaux.length > 0 ? (
                    morceaux.map((m, index) => (
                        <div
                            key={m.id || index}
                            /* Contour de la ligne */
                            className="flex flex-col md:flex-row items-center gap-[24px] p-[20px] rounded-[1rem] border border-white/5 bg-gradient-to-r from-primary/20 via-black/40 to-black shadow-xl transition-all duration-300 hover:border-primary/40 hover:from-primary/30"
                        >
                            <div className="flex items-center gap-[16px] flex-1 w-full">
                                <span className="text-[1.5rem] font-[900] text-primary min-w-[40px] drop-shadow-[0_0_8px_rgba(227,24,31,0.4)]">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold tracking-wide text-lg uppercase">{m.titre}</span>
                                    <small className="text-[#888] text-[0.8rem] font-medium">{m.detail}</small>
                                </div>
                            </div>

                            {/* Contour et dégradé autour du bouton Play / Lecteur */}
                            <div className="w-full max-w-[350px] p-[3px] rounded-full bg-gradient-to-r from-primary/60 via-black/80 to-black border border-white/10 shadow-lg">
                                <audio
                                    controls
                                    src={m.url.startsWith('/uploads') ? `http://localhost:5000${m.url}` : m.url}
                                    className="w-full h-[32px] opacity-90 hover:opacity-100 transition-opacity"
                                >
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>

                                {/* 5. BOUTON SUPPRIMER (Visible uniquement pour les 2 admins) */}
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(m.id)}
                                        className="text-[#444] hover:text-primary transition-colors p-2"
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[#9ca3af]">Aucun enregistrement disponible pour le moment.</p>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                audio::-webkit-media-controls-enclosure {
                    background-color: transparent;
                }
                audio::-webkit-media-controls-panel {
                    background-color: transparent;
                }
                /* Blanchiment des contrôles pour la visibilité */
                audio::-webkit-media-controls-play-button,
                audio::-webkit-media-controls-current-time-display,
                audio::-webkit-media-controls-time-remaining-display,
                audio::-webkit-media-controls-mute-button,
                audio::-webkit-media-controls-volume-slider {
                    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
                }
            ` }} />
        </div>
    );
}

export default Repetitions;