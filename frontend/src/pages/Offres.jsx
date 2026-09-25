// pages/Offres.jsx
import { useState, useEffect } from 'react';
import { offreService, BASE_URL } from '../services/api';
import { Helmet } from 'react-helmet-async';

// Sépare "Option N°1 Concert Pop Rock" en { label: "Option N°1", titre: "Concert Pop Rock" }
function splitTitre(titre = '') {
    const match = titre.match(/^\s*(option\s*n\s*[°º]?\s*\d+)\s*[:\-–—.]?\s*(.+)$/i);
    return match ? { label: match[1], titre: match[2] } : { label: null, titre };
}

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

                {/* EN-TÊTE DE LA PAGE */}
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
                            {offres.map((offre) => {
                                const { label, titre } = splitTitre(offre.titre);
                                return (
                                    <div key={offre.id} className="group flex flex-col bg-gray-50 dark:bg-[#0a0a0a] rounded-[1.2rem] overflow-hidden shadow-xl border border-gray-200 dark:border-white/5 transition-all duration-500 hover:shadow-[0_0_30px_rgba(227,24,31,0.15)] hover:border-[#e3181f]/50">

                                        {/* 1. EN-TÊTE DE LA CARTE (Libellé + Titre + Prix) */}
                                        <div className="p-6 md:p-8 pb-6 border-l-4 border-[#e3181f]">
                                            {label && (
                                                <span className="block text-[#e3181f] font-black uppercase tracking-[0.25em] text-xs mb-3">
                                                    {label}
                                                </span>
                                            )}
                                            <h2 className="text-2xl md:text-[1.75rem] font-black uppercase text-black dark:text-white tracking-wide leading-[1.15] [text-wrap:balance]">
                                                {titre}
                                            </h2>
                                            <div className="mt-5 inline-flex items-center gap-2 border border-[#e3181f]/40 bg-[#e3181f]/10 text-[#e3181f] px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[0.7rem]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#e3181f]"></span>
                                                {offre.prix || 'Sur devis'}
                                            </div>
                                        </div>

                                        {/* 2. IMAGE (affichée en entier sur fond flouté) */}
                                        {offre.image_url && (
                                            <div className="aspect-[16/10] w-full relative overflow-hidden bg-black">
                                                <img
                                                    src={`${BASE_URL}${offre.image_url}`}
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
                                                />
                                                <img
                                                    src={`${BASE_URL}${offre.image_url}`}
                                                    alt={offre.titre}
                                                    className="relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                                                />
                                            </div>
                                        )}

                                        {/* 3. CONTENU (Description + Bouton) */}
                                        <div className="p-6 md:p-8 pt-6 flex-1 flex flex-col">
                                            <div className="flex-1">
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                    {offre.description?.trim()}
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
                                );
                            })}
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