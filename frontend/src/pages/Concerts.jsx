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
        <div className="media-page">
            <div className="media-header">
                <h1>Tournée 2026</h1>
                <p>Retrouvez Réservoir Rock sur scène</p>
            </div>

            <div className="tour-container">
                {tourDates.length > 0 ? (
                    tourDates.map((d) => {
                        const { jour, mois } = getFormattedDate(d.date_concert);
                        return (
                            <div key={d.id} className="tour-row">
                                <div className="tour-date-box">
                                    <span className="tour-day">{jour}</span>
                                    <span className="tour-month">{mois}</span>
                                </div>

                                <div className="tour-info">
                                    <h3 className="tour-city">{d.titre}</h3>
                                    <p className="tour-venue">
                                        {d.lieu} — {d.heure.substring(0, 5)}
                                    </p>
                                </div>

                                <div className="tour-status">
                                    <span className="status-badge">ENTRÉE LIBRE</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        Aucune date programmée pour le moment.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Concerts;