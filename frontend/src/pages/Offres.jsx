// pages/Offres.jsx
import { useState, useEffect } from 'react';
import { offreService, BASE_URL } from '../services/api';
import { Helmet } from 'react-helmet-async';

function Offres() {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Le paramètre 'true' demande au back-end de ne renvoyer que les offres actives
        offreService.getAll(true)
            .then(data => {
                setOffres(data.offres || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur lors du chargement des offres :", err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Helmet>
                <title>Reservoir Rock | Nos Offres</title>
                <meta name="description" content="Découvrez les prestations et formules de concerts proposées par le groupe Reservoir Rock." />
                <link rel="canonical" href="https://resrock.fr/offres" />
            </Helmet>

            <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300 font-sans">

                {/* EN-TÊTE */}
                <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none mb-12">
                    <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                        Nos Offres
                    </h1>
                    <p className="text-[#e3181f] font-black tracking-[5px] uppercase text-sm mt-2">
                        Réservez votre concert sur mesure
                    </p>
                </div>

                <div className="max-w-[1200px] mx-auto px-[20px] pb-[80px]">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e3181f]"></div>
                        </div>
                    ) : offres.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
                            {offres.map((offre) => (
                                <div key={offre.id} className="group flex flex-col bg-gray-50 dark:bg-[#0a0a0a] rounded-[1.2rem] overflow-hidden shadow-xl border border-gray-200 dark:border-white/5 transition-all duration-500 hover:shadow-[0_0_30px_rgba(227,24,31,0.15)] hover:border-[#e3181f]/50">

                                    {/* IMAGE DE L'OFFRE */}
                                    {offre.image_url ? (
                                        <div className="h-64 w-full relative overflow-hidden bg-black">
                                            <img
                                                src={`${BASE_URL}${offre.image_url}`}
                                                alt={offre.titre}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                                <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-wider">{offre.titre}</h2>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-24 w-full bg-gradient-to-r from-[#111] to-black flex items-end p-6 border-b border-[#e3181f]/20">
                                            <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-wider">{offre.titre}</h2>
                                        </div>
                                    )}

                                    {/* CONTENU */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col relative">
                                        {/* BADGE PRIX */}
                                        <div className={`absolute ${offre.image_url ? '-top-6' : 'top-6'} right-6 bg-[#e3181f] text-white px-4 py-2 rounded-full font-black uppercase tracking-widest text-sm shadow-lg`}>
                                            {offre.prix || 'Sur devis'}
                                        </div>

                                        <div className={`flex-1 ${!offre.image_url ? 'mt-8' : 'mt-2'}`}>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                {offre.description}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                                            <a
                                                href="/contact"
                                                className="inline-block w-full text-center bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase tracking-widest rounded-lg transition-colors hover:bg-[#e3181f] dark:hover:bg-[#e3181f] hover:text-white"
                                            >
                                                Demander un devis
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                            <p className="text-gray-400 dark:text-[#666] font-bold uppercase tracking-[3px]">
                                Aucune offre n'est disponible pour le moment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Offres;