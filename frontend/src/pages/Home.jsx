import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function Home() {
    const { isAuthenticated } = useAuth();
    const [nextConcert, setNextConcert] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/concerts')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.concerts) && data.concerts.length > 0) {
                    setNextConcert(data.concerts[0]);
                }
            })
            .catch(err => console.error("Erreur chargement prochain concert:", err));
    }, []);

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] flex flex-col justify-center items-center text-center bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.8)),url('/images/groupe.jpg')] bg-no-repeat bg-center bg-cover">

            {/* Titre avec effet de balayage rouge */}
            <h1 className="text-[3.5rem] md:text-[5.5rem] font-[300] uppercase m-0 leading-[1] tracking-[0.15em] animate-shimmer inline-block transform scale-x-[0.95] origin-center">
                Réservoir Rock
            </h1>
            {/* Section Concert */}
            <section className="bg-[rgba(227,27,35,0.4)] border border-primary px-[40px] py-[20px] mt-[60px] rounded-[4px] animate-pulse-rock">
                <h2 className="text-[1.875rem] font-[800] uppercase mb-[8px] text-white">
                    Prochain Concert
                </h2>
                {nextConcert ? (
                    <p className="text-white text-[1rem] font-medium leading-[1.5]">
                        Le {new Date(nextConcert.date_concert).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {nextConcert.titre} ({nextConcert.lieu}) à {nextConcert.heure.substring(0, 5)}
                    </p>
                ) : (
                    <p className="text-white text-[1rem] leading-[1.5] italic opacity-60">
                        Aucune date programmée pour le moment.
                    </p>
                )}
            </section>
        </div>
    );
}

export default Home;