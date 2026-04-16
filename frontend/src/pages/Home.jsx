// pages/Home.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { concertService, settingsService, BASE_URL } from '../services/api';

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
    const lightGradient = `linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.85))`;
    const darkGradient = `linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.8))`;

    return (
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

            <h1 className="text-[3.5rem] md:text-[5.5rem] uppercase m-0 leading-[1.2] tracking-[0.1em] animate-shimmer inline-block transform origin-center text-black dark:text-white transition-colors duration-300">
                Réservoir Rock
            </h1>

            <section className="px-[40px] py-[30px] mt-[60px] rounded-[8px] animate-pulse-rock transition-all duration-300
                bg-white shadow-[10px_10px_0px_0px_rgba(255,0,0,0.1)]
                dark:bg-[#ff0000]/20 dark:backdrop-blur-lg dark:shadow-[0_0_30px_rgba(255,0,0,0.15)]">

                <h2 className="text-[1.5rem] font-black uppercase mb-[12px] text-black dark:text-white transition-colors tracking-tighter">
                    Prochain Concert
                </h2>

                {nextConcert ? (
                    <div className="space-y-2">
                        <p className="text-[#ff0000] dark:text-white text-[1.2rem] font-black uppercase tracking-[0.2em]">
                            {new Date(nextConcert.date_concert).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-gray-900 dark:text-white text-[1.1rem] font-medium transition-colors">
                            {nextConcert.titre} <span className="text-[#ff0000] mx-2">//</span> {nextConcert.lieu}
                        </p>
                        <p className="text-gray-600 dark:text-white/60 text-sm font-bold uppercase tracking-widest mt-2">
                            {nextConcert.heure.substring(0, 5)}
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-white/40 text-[1rem] leading-[1.5] italic transition-colors">
                        Aucune date programmée pour le moment.
                    </p>
                )}
            </section>
        </div>
    );
}

export default Home;