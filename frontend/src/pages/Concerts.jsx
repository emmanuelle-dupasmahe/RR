// pages/Concerts.jsx
import { useState, useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import { concertService, settingsService, BASE_URL } from '../services/api';
import { Helmet } from 'react-helmet-async';

function Concerts() {
    const [tourDates, setTourDates] = useState([]);
    const [tourTitle, setTourTitle] = useState('Chargement...');
    const [selectedConcert, setSelectedConcert] = useState(null);

    useEffect(() => {
        settingsService.getTourTitle()
            .then(data => setTourTitle(data.value || 'Tournée'))
            .catch(() => setTourTitle('Tournée'));

        concertService.getAll()
            .then(data => setTourDates(data.concerts || []))
            .catch(err => console.error("Erreur chargement concerts:", err));
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setSelectedConcert(null);
            }
        };

        if (selectedConcert) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [selectedConcert]);

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = date.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
        const annee = date.getFullYear();
        return { jour, mois, annee };
    };

    const getFlyerUrl = (flyerPath) => {
        if (!flyerPath) return '';
        return flyerPath.startsWith('/uploads') ? `${BASE_URL}${flyerPath}` : flyerPath;
    };

    const getPhoneHref = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/[^\d+]/g, '');
        return `tel:${cleaned}`;
    };

    return (
        <>
            <Helmet>
                <title>Reservoir Rock | Concerts</title>
                <meta
                    name="description"
                    content="Reservoir Rock, page sur les concerts."
                />
                <link rel="canonical" href="https://resrock.fr/concerts" />
            </Helmet>
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
                                        className="group flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-[20px] rounded-[1rem] border transition-all duration-500 shadow-xl
                                        /* Mode Clair */
                                        bg-white border-gray-200 hover:border-black/20
                                        /* Mode Sombre : On utilise un fond uni sombre et une lueur rouge au survol */
                                        dark:bg-[#0a0a0a] dark:border-white/5 dark:hover:border-primary/50 dark:hover:shadow-[0_0_30px_rgba(227,24,31,0.15)]"
                                    >
                                        {/* BLOC DATE */}
                                        <div className="flex flex-col items-center justify-center w-[80px] h-[80px] md:w-[90px] md:h-[90px] rounded-lg border transition-all duration-300
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
                                            <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-600 dark:text-gray-300 text-[0.72rem] font-semibold tracking-wide">
                                                    <LocationOnIcon sx={{ fontSize: 15 }} />
                                                    {d.lieu}
                                                </span>

                                                {d.adresse && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-gray-600 dark:text-gray-300 text-[0.72rem] font-semibold tracking-wide">
                                                        {d.adresse}
                                                    </span>
                                                )}

                                                {d.telephone && (
                                                    <a
                                                        href={getPhoneHref(d.telephone)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-primary/40 bg-primary/5 text-primary text-[0.72rem] font-semibold tracking-wide hover:bg-primary/10 transition-colors"
                                                    >
                                                        <PhoneIcon sx={{ fontSize: 14 }} />
                                                        {d.telephone}
                                                    </a>
                                                )}

                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-primary/40 bg-primary/5 text-primary text-[0.72rem] font-bold tracking-wide uppercase">
                                                    <AccessTimeIcon sx={{ fontSize: 15 }} />
                                                    {d.heure.substring(0, 5)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* STATUT / BOUTON */}
                                        <div className="flex flex-col md:flex-row justify-end gap-2 w-full md:w-auto">
                                            {d.flyer_url && (
                                                <button
                                                    onClick={() => setSelectedConcert(d)}
                                                    className="w-full md:w-auto text-center px-[20px] py-[10px] rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-black uppercase tracking-[2px] text-[0.75rem] cursor-pointer"
                                                >
                                                    Flyer
                                                </button>
                                            )}

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

                {selectedConcert && (
                    <div
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
                        onClick={() => setSelectedConcert(null)}
                    >
                        <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                onClick={() => setSelectedConcert(null)}
                                className="absolute top-2 right-2 z-20 bg-black/75 hover:bg-black text-white rounded-full p-2 transition-colors border border-white/20"
                                aria-label="Fermer la modale"
                            >
                                <CloseIcon sx={{ fontSize: 20 }} />
                            </button>

                            <img
                                src={getFlyerUrl(selectedConcert.flyer_url)}
                                alt={`Flyer ${selectedConcert.titre}`}
                                className="block w-auto h-auto max-w-[96vw] max-h-[92dvh] object-contain rounded-xl shadow-2xl"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Concerts;
