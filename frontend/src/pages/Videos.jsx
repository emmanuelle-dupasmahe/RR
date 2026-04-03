// pages/Videos.jsx
function Videos() {
    return (
        <div className="media-page">
            <div className="media-header">
                <h1>Vidéos Live</h1>
                <p>L'expérience Réservoir Rock en images</p>
            </div>

            <div className="video-grid">
                {/* On enveloppe l'iframe dans une 'video-card' pour le look Ampli/Marshall */}
                <div className="video-card">
                    <div className="video-wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/UrrtAPj9Nzw?si=0VHBpFre6Rg5T6U4"
                            title="Réservoir Rock Live"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-info">
                        <h3>Réservoir Rock</h3>
                        <p>Le Rayolet à Six-Fours</p>
                    </div>
                </div>

                <div className="video-card">
                    <div className="video-wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/ac_1MdSA9u0?si=1S2ZS-nhFQCEnijG"
                            title="Réservoir Rock"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-info">
                        <h3>Réservoir Rock</h3>
                        <p>Bormes les Mimosas</p>
                    </div>
                </div>

                <div className="video-card">
                    <div className="video-wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/gJ5ZjBaVQOs"
                            title="Réservoir Rock"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-info">
                        <h3>Réservoir Rock</h3>
                        <p>Restaurant Domaine Coudoulière Six-Fours</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Videos;