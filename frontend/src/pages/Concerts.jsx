/// pages/Concerts.jsx
function Concerts() {
    const tourDates = [
        {
            id: 1,
            jour: "09",
            mois: "MAI",
            annee: "2026",
            ville: "SANARY-SUR-MER",
            lieu: "Just Rosé",
            heure: "14:00",
            statut: "ENTRÉE LIBRE"
        },
        {
            id: 2,
            jour: "07",
            mois: "AOUT",
            annee: "2026",
            ville: "LA LONDE-LES-MAURES",
            lieu: "AZUREVA",
            heure: "20:00",
            statut: "ENTRÉE LIBRE"
        },
        //  ajouter d'autres dates ici plus tard
    ];

    return (
        <div className="media-page">
            <div className="media-header">
                <h1>Tournée 2026</h1>
                <p>Retrouvez Réservoir Rock sur scène</p>
            </div>

            <div className="tour-container">
                {tourDates.map((d) => (
                    <div key={d.id} className="tour-row">
                        <div className="tour-date-box">
                            <span className="tour-day">{d.jour}</span>
                            <span className="tour-month">{d.mois}</span>
                        </div>

                        <div className="tour-info">
                            <h3 className="tour-city">{d.ville}</h3>
                            <p className="tour-venue">{d.lieu} — {d.heure}</p>
                        </div>

                        <div className="tour-status">
                            <span className="status-badge">{d.statut}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Concerts;