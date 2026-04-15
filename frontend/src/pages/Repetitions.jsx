// pages/Repetitions.jsx
import { useState, useEffect, useRef } from 'react';
import RepetitionsSkeleton from '../components/RepetitionsSkeleton';

function AudioPlayer({ src, startTime, endTime }) {
    const audioRef = useRef(null);

    const handlePlay = () => {
        const audio = audioRef.current;
        if (audio.currentTime < (startTime || 0)) {
            audio.currentTime = startTime || 0;
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (endTime && audio.currentTime >= endTime) {
            audio.pause();
            audio.currentTime = startTime || 0;
        }
    };

    return (
        <audio
            ref={audioRef}
            controls
            src={src}
            onPlay={handlePlay}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-[32px] opacity-90 hover:opacity-100 transition-opacity"
        >
            Votre navigateur ne supporte pas l'élément audio.
        </audio>
    );
}

function Repetitions() {
    const [morceaux, setMorceaux] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchMorceaux();
    }, []);

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300">
            
            {/* EN-TÊTE */}
            <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    Studio Répétitions
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    Enregistrements bruts
                </p>
            </div>

            {/* LISTE DES MORCEAUX */}
            <div className="max-w-[56rem] mx-auto px-[20px] py-[40px] flex flex-col gap-[16px]">
                {loading ? (
                    <RepetitionsSkeleton />
                ) : morceaux.length > 0 ? (
                    morceaux.map((m, index) => (
                        <div
                            key={m.id || index}
                            className="flex flex-col md:flex-row items-center gap-[24px] p-[20px] rounded-[1rem] border transition-all duration-300 shadow-xl 
                                /* Mode Clair */
                                bg-gray-50 border-gray-200 
                                /* Mode Sombre : Fond uni sombre pour faire ressortir le lecteur */
                                dark:bg-[#111] dark:border-white/5 dark:hover:border-primary/30"
                        >
                            <div className="flex items-center gap-[16px] flex-1 w-full">
                                <span className="text-[1.5rem] font-[900] text-primary min-w-[40px] drop-shadow-[0_0_8px_rgba(227,24,31,0.4)]">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-black dark:text-white font-bold tracking-wide text-lg uppercase transition-colors">
                                        {m.titre}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <small className="text-gray-500 dark:text-[#888] text-[0.8rem] font-medium transition-colors">
                                            {m.detail}
                                        </small>
                                        {m.end_time && (
                                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                                                Segment: {m.start_time || 0}s - {m.end_time}s
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Conteneur Lecteur Audio : On a enlevé les dégradés ici car ils sont gérés par le CSS */}
                            <div className="w-full max-w-[350px] p-[2px] rounded-full overflow-hidden border border-transparent dark:border-white/10 shadow-lg">
                                <AudioPlayer 
                                    src={m.url.startsWith('/uploads') ? `http://localhost:5000${m.url}` : m.url}
                                    startTime={m.start_time}
                                    endTime={m.end_time}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-[#9ca3af]">Aucun enregistrement disponible pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default Repetitions;