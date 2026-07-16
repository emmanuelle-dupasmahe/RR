// pages/Home.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { concertService, settingsService, BASE_URL } from '../services/api';
import { Helmet } from 'react-helmet-async';

function Home() {
    const { isAuthenticated } = useAuth();
    const [nextConcert, setNextConcert] = useState(null);

    // États pour les images (valeurs par défaut pointant sur tes fichiers actuels)
    const [heroDesktop, setHeroDesktop] = useState('/images/groupe.jpg');
    const [heroMobile, setHeroMobile] = useState('/images/RR_mobile.jpg');

    useEffect(() => {
        // 1. Charger le prochain concert
        concertService.getAll()
            .then(data => {
                if (Array.isArray(data.concerts) && data.concerts.length > 0) {
                    setNextConcert(data.concerts[0]);
                }
            })
            .catch(err => console.error("Erreur prochain concert:", err));

        // 2. Charger les photos personnalisées du Dashboard (si elles existent)
        settingsService.getGroupSettings()
            .then(settings => {
                // settings est maintenant un objet direct, plus besoin de .find() !

                if (settings.hero_desktop) {
                    setHeroDesktop(`${BASE_URL}${settings.hero_desktop}`);
                }

                if (settings.hero_mobile) {
                    setHeroMobile(`${BASE_URL}${settings.hero_mobile}`);
                }
            })
            .catch(err => console.log("Utilisation des images par défaut", err));
    }, []);

    // Détermination de l'image selon la taille de l'écran (approche simple)
    const [currentHero, setCurrentHero] = useState(heroDesktop);

    useEffect(() => {
        const handleResize = () => {
            setCurrentHero(window.innerWidth < 768 ? heroMobile : heroDesktop);
        };
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [heroDesktop, heroMobile]);

    // Préparation des gradients (on garde tes réglages exacts)
    const lightGradient = `linear-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0.55))`;
    const darkGradient = `linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.4))`;

    return (
        <>
            <Helmet>
                <title>Reservoir Rock | Groupe de Rock</title>
                <meta
                    name="description"
                    content="Reservoir Rock, groupe de rock : concerts, répétitions, vidéos et infos."
                />
                <link rel="canonical" href="https://resrock.fr/" />
            </Helmet>

            <div
                className="mt-[80px] min-h-[calc(100vh-82px)] flex flex-col justify-center items-center text-center bg-no-repeat bg-cover bg-center transition-all duration-500"
                style={{
                    // On injecte l'image dynamiquement ici
                    backgroundImage: `var(--hero-gradient), url(${currentHero})`
                }}
            >
                {/* Petit hack CSS pour gérer le gradient Clair/Sombre dynamiquement */}
                <style>{`
                div { --hero-gradient: ${lightGradient}; }
                .dark div { --hero-gradient: ${darkGradient}; }
            `}</style>

                <h1
                    className="text-[3.5rem] md:text-[5.5rem] uppercase m-0 leading-[1.2] tracking-[0.1em] animate-shimmer inline-block transform origin-center text-black dark:text-white transition-colors duration-300 notranslate"
                    translate="no"
                >
                    Réservoir Rock
                </h1>

                <section className="w-[92%] max-w-2xl px-5 py-5 md:px-10 md:py-8 mt-8 md:mt-14 rounded-2xl border border-primary/60 bg-white/65 dark:bg-primary/30 text-black dark:text-primary dark:shadow-none">

                    <h2 className="text-[1.15rem] md:text-[1.5rem] font-black uppercase mb-3 text-black dark:text-white transition-colors tracking-tight md:tracking-tighter">
                        Prochain Concert
                    </h2>

                    {nextConcert ? (
                        <div className="space-y-2">
                            <p className="text-[#cc1218] dark:text-white text-[0.92rem] md:text-[1.2rem] font-black uppercase tracking-[0.12em] md:tracking-[0.2em]">
                                {new Date(nextConcert.date_concert).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            <p className="text-gray-900 dark:text-white text-[0.95rem] md:text-[1.1rem] font-semibold md:font-medium transition-colors leading-snug">
                                {nextConcert.titre} <span className="text-[#ff0000] mx-2">//</span> {nextConcert.lieu}
                            </p>
                            <p className="text-gray-700 dark:text-white/60 text-[11px] md:text-sm font-black uppercase tracking-[0.18em] md:tracking-widest mt-2 flex justify-center items-center flex-wrap">
    {nextConcert.heure.substring(0, 5)} 
    {nextConcert.statut && (
        <>
            <span className="text-[#ff0000] mx-2">•</span> 
            <span className={nextConcert.statut === 'Privé' ? 'text-orange-600 dark:text-orange-400 font-extrabold' : ''}>
                {nextConcert.statut}
            </span>
        </>
    )}
</p>
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-white/40 text-[0.95rem] md:text-[1rem] leading-[1.5] italic transition-colors">
                            Aucune date programmée pour le moment.
                        </p>
                    )}
                </section>
            </div>
        </>
    );
}

export default Home;
