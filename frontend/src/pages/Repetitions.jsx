import { useState, useEffect } from 'react';

function Repetitions() {
    const [morceaux, setMorceaux] = useState([]);
    const [loading, setLoading] = useState(true);

    // Charger les répétitions depuis l'API
    const fetchMorceaux = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/repetitions');
            const data = await res.json();
            setMorceaux(Array.isArray(data) ? data : []);
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
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-dark-bg">
            {/* EN-TÊTE */}
            <div className="text-center py-[48px] border-b border-[#1f2937]">
                <h1 className="text-[3rem] font-[900] uppercase mb-[12px] text-white leading-tight">
                    Studio Répétitions
                </h1>
                <p className="text-[#9ca3af] text-[1.125rem]">
                    Enregistrements bruts - Réservoir Rock
                </p>
            </div>

            {/* LISTE DES MORCEAUX */}
            <div className="max-w-[56rem] mx-auto px-[20px] py-[40px] flex flex-col gap-[16px]">
                {loading ? (
                    <p className="text-center text-[#9ca3af]">Chargement du studio...</p>
                ) : morceaux.length > 0 ? (
                    morceaux.map((m, index) => (
                        <div
                            key={m.id || index}
                            className="flex flex-col md:flex-row items-center gap-[24px] bg-[#1f2937] p-[16px] rounded-[0.5rem] transition-colors duration-200 hover:bg-[#111827]"
                        >
                            <div className="flex items-center gap-[16px] flex-1 w-full">
                                {/* Numérotation dynamique basée sur l'index */}
                                <span className="text-[1.5rem] font-[900] text-primary min-w-[40px]">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">{m.titre}</span>
                                    <small className="text-[#9ca3af] text-[0.75rem]">{m.detail}</small>
                                </div>
                            </div>

                            {/* LECTEUR AUDIO */}
                            <div className="w-full max-w-[320px]">
                                <audio controls src={m.url} className="w-full h-[32px] custom-audio">
                                    Votre navigateur ne supporte pas l'élément audio.
                                </audio>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[#9ca3af]">Aucun enregistrement disponible pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default Repetitions;