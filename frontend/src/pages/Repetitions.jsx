// pages/Repetitions.jsx
function Repetitions() {
    const morceaux = [
        { id: 1, titre: "Atomic City - U2", detail: "Répète du 12 Février 2026", url: "/audio/Atomic_city.mp3" },
        { id: 2, titre: "Beautiful Day - U2", detail: "Répète du 12 Février 2026", url: "/audio/Beautiful_day.mp3" },
        { id: 3, titre: "With Or Whithout You - U2", detail: "Répète du 15 décembre 2025", url: "/audio/With_or.mp3" },
        { id: 4, titre: "Undisclosed Desires - Muse", detail: "Répète du 12 Février 2026", url: "/audio/Undisclosed_desire.mp3" },
        { id: 5, titre: "Cake By The Ocean - DNCE", detail: "Répète du 22 avril 2024", url: "/audio/Cake_ocean.mp3" },
        { id: 6, titre: "Locked Out Of Heaven - Bruno Mars", detail: "Répète du 22 avril 2024", url: "/audio/Locked_out.mp3" },
    ];

    return (
        <div className="media-page">
            <div className="media-header">
                <h1>Studio Répétitions</h1>
                <p>Enregistrements bruts - Réservoir Rock</p>
            </div>

            <div className="playlist-container">
                {morceaux.map((m) => (
                    <div key={m.id} className="track-card">
                        <div className="track-info">
                            <span className="track-number">{m.id.toString().padStart(2, '0')}</span>
                            <div className="track-text">
                                <span className="track-name">{m.titre}</span>
                                <small className="track-detail">{m.detail}</small>
                            </div>
                        </div>
                        <div className="audio-player-wrapper">
                            <audio controls src={m.url}>
                                Votre navigateur ne supporte pas l'élément audio.
                            </audio>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Repetitions;