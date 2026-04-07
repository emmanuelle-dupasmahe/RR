import { useState, useEffect } from 'react';

function Concerts() {
    const [tourDates, setTourDates] = useState([]);

    useEffect(() => {
        // On récupère les données de ton API Node
        fetch('http://localhost:5000/api/concerts')
            .then(res => res.json())
            .then(data => setTourDates(data))
            .catch(err => console.error("Erreur chargement concerts:", err));
    }, []);

    // Fonction utilitaire pour extraire le jour et le mois de la date SQL
    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = date.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
        return { jour, mois };
    };

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-dark-bg">
            <div className="text-center py-[48px] border-b border-[#1f2937]">
                <h1 className="text-[3rem] font-[900] uppercase mb-[12px] text-white leading-tight">Tournée 2026</h1>
                <p className="text-[#9ca3af] text-[1.125rem]">Retrouvez Réservoir Rock sur scène</p>
            </div>

            <div className="mt-[32px] max-w-[56rem] mx-auto px-[20px]">
                {tourDates.length > 0 ? (
                    tourDates.map((d) => {
                        const { jour, mois } = getFormattedDate(d.date_concert);
                        return (
                            <div key={d.id} className="flex items-center justify-between py-[32px] border-b border-[#374151]">
                                <div className="flex flex-col items-center justify-center w-[80px] h-[80px] border-2 border-primary mr-[40px] shrink-0">
                                    <span className="text-[1.875rem] font-[900] leading-none text-white">{jour}</span>
                                    <span className="text-[0.75rem] text-primary font-bold uppercase mt-[4px]">{mois}</span>
                                </div>

                                <div className="flex-1 px-[32px]">
                                    <h3 className="text-[1.25rem] font-bold text-white mb-[4px]">{d.titre}</h3>
                                    <p className="text-[#9ca3af] text-[0.875rem]">
                                        {d.lieu} — {d.heure.substring(0, 5)}
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <span className="px-[15px] py-[8px] border border-white text-[0.7rem] font-[900] uppercase min-w-[110px] text-center text-white">ENTRÉE LIBRE</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-[#666666] mt-[20px]">
                        Aucune date programmée pour le moment.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Concerts;