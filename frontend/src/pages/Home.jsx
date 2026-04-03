// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-container">
            
            <h1>Réservoir Rock</h1>

            <div className="cta-buttons">
                {isAuthenticated && (
                    <Link to="/dashboard" className="btn-primary">Espace Membre</Link>
                )}
            </div>

            
            <section className="next-concerts">
                <h2>Prochain Concert</h2>
                <p>Le samedi 9 mai 2026 à Sanary pour Just Rosé 14h</p>
            </section>
        </div>
    );
}

export default Home;