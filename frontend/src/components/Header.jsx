// components/Header.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header>
            <Link to="/" className="logo-link">
                <img
                    src="/images/logo_rr.png"
                    alt="Réservoir Rock Logo"
                    className="logo-image"
                />
            </Link>

            <nav>
                <NavLink to="/legroupe">Le groupe</NavLink>
                <NavLink to="/repetition">Répétitions</NavLink>
                <NavLink to="/videos">Vidéos</NavLink>
                <NavLink to="/concerts">Concerts</NavLink>

                {/* Le Dashboard ne s'affiche que si on est connecté */}
                {isAuthenticated && <NavLink to="/dashboard">Admin</NavLink>}
            </nav>

            {isAuthenticated ? (
                <div className="auth-zone">
                    <span>{user?.firstname}</span>
                    <button onClick={handleLogout}>Déconnexion</button>
                </div>
            ) : (
                <div className="auth-zone">
                    <Link to="/login">Connexion</Link>
                    <Link to="/register">S'inscrire</Link>
                </div>
            )}
        </header>
    );
}

export default Header;