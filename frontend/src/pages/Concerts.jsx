import { useState, useEffect } from 'react';

function Concerts() {
    const [tourDates, setTourDates] = useState([]);
    const [tourTitle, setTourTitle] = useState('Chargement...');

    useEffect(() => {
        fetch('http://localhost:5000/api/settings/tour_title')
            .then(res => res.json())
            .then(data => setTourTitle(data.value || 'Tournée'))
            .catch(() => setTourTitle('Tournée'));

        fetch('http://localhost:5000/api/concerts')
            .then(res => res.json())
            .then(data => setTourDates(data.concerts || []))
            .catch(err => console.error("Erreur chargement concerts:", err));
    }, []);

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = date.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
        const annee = date.getFullYear();
        return { jour, mois, annee };
    };

    

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-black">
            {/* EN-TÊTE */}
            <div className="text-center py-[48px]  bg-gradient-to-b from-[#111] to-black">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-white inline-block">
                    {tourTitle}
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    Live Experience
                </p>
            </div>

            {/* LISTE DES DATES */}
            <div className="mt-[40px] max-w-[65rem] mx-auto px-[20px] pb-[80px]">
                {tourDates.length > 0 ? (
                    <div className="flex flex-col gap-[12px]">
                        {tourDates.map((d) => {
                            const { jour, mois, annee } = getFormattedDate(d.date_concert);
                            return (
                                <div 
                                    key={d.id} 
                                    className="group flex flex-col md:flex-row items-center gap-6 p-[20px] rounded-[1rem] border border-white/5 bg-gradient-to-r from-[#111] via-black to-black transition-all duration-300 hover:border-primary/40 hover:from-primary/10 shadow-lg"
                                >
                                    {/* BLOC DATE STYLE MUSE */}
                                    <div className="flex flex-col items-center justify-center w-[90px] h-[90px] rounded-lg border border-primary/30 bg-black group-hover:border-primary transition-colors shadow-[0_0_15px_rgba(227,24,31,0.1)] group-hover:shadow-[0_0_20px_rgba(227,24,31,0.3)]">
                                        <span className="text-[2rem] font-[900] leading-none text-white">{jour}</span>
                                        <span className="text-[0.85rem] text-primary font-black uppercase mt-[2px]">{mois}</span>
                                        <span className="text-[0.65rem] text-[#444] font-bold">{annee}</span>
                                    </div>

                                    {/* INFOS CONCERT */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-[1.5rem] font-black text-white uppercase tracking-wide group-hover:text-primary transition-colors">
                                            {d.titre}
                                        </h3>
                                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-1">
                                            <p className="text-[#9ca3af] font-medium uppercase text-sm tracking-wider">
                                                📍 {d.lieu}
                                            </p>
                                            <span className="hidden md:block text-[#333]">|</span>
                                            <p className="text-primary font-bold text-sm uppercase">
                                                🕒 {d.heure.substring(0, 5)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* STATUT / BOUTON */}
                                    <div className="flex justify-end">
                                        <span className="px-[24px] py-[10px] rounded-full border-2 border-white/10 group-hover:border-primary text-[0.75rem] font-black uppercase tracking-[2px] text-white transition-all">
                                            {d.statut || "Entrée Libre"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-[#666666] font-bold uppercase tracking-[3px]">
                            Aucune date programmée pour le moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Concerts;