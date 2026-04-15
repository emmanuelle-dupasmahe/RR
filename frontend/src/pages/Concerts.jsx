// pages/Concerts.jsx
import { useState, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300">
            
            {/* EN-TÊTE ADAPTATIF */}
            <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    {tourTitle}
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    Live Experience
                </p>
            </div>

            {/* LISTE DES DATES */}
            <div className="mt-[40px] max-w-[65rem] mx-auto px-[20px] pb-[80px]">
                {tourDates.length > 0 ? (
                    <div className="flex flex-col gap-[16px]">
                        {tourDates.map((d) => {
                            const { jour, mois, annee } = getFormattedDate(d.date_concert);
                            return (
                                <div
                                    key={d.id}
                                    className="group flex flex-col md:flex-row items-center gap-6 p-[20px] rounded-[1rem] border transition-all duration-500 shadow-xl
                                        /* Mode Clair */
                                        bg-white border-gray-200 hover:border-black/20
                                        /* Mode Sombre : On utilise un fond uni sombre et une lueur rouge au survol */
                                        dark:bg-[#0a0a0a] dark:border-white/5 dark:hover:border-primary/50 dark:hover:shadow-[0_0_30px_rgba(227,24,31,0.15)]"
                                >
                                    {/* BLOC DATE */}
                                    <div className="flex flex-col items-center justify-center w-[90px] h-[90px] rounded-lg border transition-all duration-300
                                        /* Mode Clair */
                                        bg-gray-100 border-gray-300
                                        /* Mode Sombre */
                                        dark:bg-black dark:border-white/10 dark:group-hover:border-primary dark:group-hover:shadow-[0_0_15px_rgba(227,24,31,0.3)]"
                                    >
                                        <span className="text-[2rem] font-[900] leading-none text-black dark:text-white transition-colors">{jour}</span>
                                        <span className="text-[0.85rem] text-primary font-black uppercase mt-[2px]">{mois}</span>
                                        <span className="text-[0.65rem] text-gray-400 dark:text-[#444] font-bold">{annee}</span>
                                    </div>

                                    {/* INFOS CONCERT */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-[1.5rem] font-black text-black dark:text-white uppercase tracking-wide group-hover:text-primary transition-colors duration-300">
                                            {d.titre}
                                        </h3>
                                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-1">
                                            <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium uppercase text-sm tracking-wider group-hover:dark:text-white transition-colors">
                                                <LocationOnIcon sx={{ fontSize: 18, mb: '2px' }} /> {d.lieu}
                                            </p>
                                            <span className="hidden md:block text-gray-300 dark:text-[#222]">|</span>
                                            <p className="flex items-center gap-1 text-primary font-bold text-sm uppercase">
                                                <AccessTimeIcon sx={{ fontSize: 18, mb: '2px' }} /> {d.heure.substring(0, 5)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* STATUT / BOUTON */}
                                    <div className="flex justify-end w-full md:w-auto">
                                        <span className="w-full md:w-auto text-center px-[24px] py-[10px] rounded-full border-2 transition-all duration-300 font-black uppercase tracking-[2px] text-[0.75rem]
                                            /* Mode Clair */
                                            border-black text-black group-hover:bg-black group-hover:text-white
                                            /* Mode Sombre */
                                            dark:border-white/20 dark:text-white dark:group-hover:border-primary dark:group-hover:bg-primary/10">
                                            {d.statut || "Entrée Libre"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl transition-colors">
                        <p className="text-gray-400 dark:text-[#666666] font-bold uppercase tracking-[3px]">
                            Aucune date programmée pour le moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Concerts;