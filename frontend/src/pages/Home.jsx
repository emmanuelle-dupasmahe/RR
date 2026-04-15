// pages/Home.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { concertService } from '../services/api';

function Home() {
    const { isAuthenticated } = useAuth();
    const [nextConcert, setNextConcert] = useState(null);

    useEffect(() => {
        concertService.getAll()
            .then(data => {
                if (Array.isArray(data.concerts) && data.concerts.length > 0) {
                    setNextConcert(data.concerts[0]);
                }
            })
            .catch(err => console.error("Erreur chargement prochain concert:", err));
    }, []);

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] flex flex-col justify-center items-center text-center 
            bg-no-repeat bg-center bg-cover transition-all duration-500
            /* Overlay clair */
            bg-[linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.85)),url('/images/groupe.jpg')] 
            /* Overlay sombre légèrement réduit pour voir l'image (0.5 au lieu de 0.6) */
            dark:bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.8)),url('/images/groupe.jpg')]">

            {/* Titre principal */}
            <h1 className="text-[3.5rem] md:text-[5.5rem] uppercase m-0 leading-[1.2] tracking-[0.1em] animate-shimmer inline-block transform origin-center text-black dark:text-white transition-colors duration-300">

                Réservoir Rock

            </h1>
            {/* Section Concert : Rouge Vif Électrique (Moins sombre) */}
            <section className="px-[40px] py-[30px] mt-[60px] rounded-[8px] animate-pulse-rock transition-all duration-300
    /* Mode Clair */
    bg-white shadow-[10px_10px_0px_0px_rgba(255,0,0,0.1)]
    
    /* Mode Sombre : Rouge pur sans compromis (#ff0000) et opacité augmentée à 20% */
    dark:bg-[#ff0000]/20 dark:backdrop-blur-lg dark:shadow-[0_0_30px_rgba(255,0,0,0.25)]">

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