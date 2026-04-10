// components/Header.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate(isAdmin ? '/login' : '/');
    };

    const navLinkClass = ({ isActive }) =>
        `text-[1.1rem] lg:text-[0.95rem] font-[700] uppercase no-underline tracking-[1px] transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-[#888888] hover:text-white'
        }`;

    const authLinkClass = "bg-transparent text-black text-[0.65rem] font-[900] uppercase no-underline tracking-[1px] transition-colors duration-300 hover:text-[#666666]";

    return (
        <header className="fixed top-0 left-0 z-[1000] w-full flex justify-between lg:justify-start items-center px-6 md:px-[40px] bg-black border-b-2 border-[#222] h-[80px] box-border">
            
            {/* LOGO AVEC EFFET PULSATION */}
            <Link to="/" className="flex items-center no-underline w-[120px] lg:w-[150px] shrink-0">
                <img
                    src="/images/logo_rr.png"
                    alt="Réservoir Rock Logo"
                    className="w-[70px] md:w-[80px] h-auto transition-transform duration-200 hover:scale-110 animate-pulse"
                />
            </Link>

            {/* BOUTON BURGER (Mobile uniquement) */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col justify-center items-center gap-1.5 z-[1100] bg-transparent border-none cursor-pointer"
            >
                <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {/* NAVIGATION DESKTOP */}
            <nav className="hidden lg:flex gap-[35px] ml-[30px]">
                <NavLink to="/legroupe" className={navLinkClass}>Le groupe</NavLink>
                <NavLink to="/repetition" className={navLinkClass}>Répétitions</NavLink>
                <NavLink to="/videos" className={navLinkClass}>Vidéos</NavLink>
                <NavLink to="/concerts" className={navLinkClass}>Concerts</NavLink>
                <NavLink to="/livredor" className={navLinkClass}>Livre d'or</NavLink>
                {isAuthenticated && user?.role === 'admin' && <NavLink to="/dashboard" className={navLinkClass}>Admin</NavLink>}
            </nav>

            {/* BLOC AUTH (Desktop) */}
            <div className="hidden lg:flex items-center bg-white px-[15px] py-[6px] ml-auto gap-[15px] whitespace-nowrap shrink-0">
                {isAuthenticated ? (
                    <>
                        <span className="text-black text-[0.65rem] font-[900] uppercase">{user?.firstname}</span>
                        <button onClick={handleLogout} className={`${authLinkClass} cursor-pointer border-none font-black`}>Déconnexion</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={authLinkClass}>Connexion</Link>
                        <Link to="/register" className={authLinkClass}>S'inscrire</Link>
                    </>
                )}
            </div>

            {/* MENU MOBILE (OVERLAY) */}
            <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${
                isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                <nav className="flex flex-col items-center gap-8 mb-12">
                    <NavLink to="/legroupe" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Le groupe</NavLink>
                    <NavLink to="/repetition" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Répétitions</NavLink>
                    <NavLink to="/videos" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Vidéos</NavLink>
                    <NavLink to="/concerts" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Concerts</NavLink>
                    <NavLink to="/livredor" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Livre d'or</NavLink>
                    {isAuthenticated && user?.role === 'admin' && (
                        <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Admin</NavLink>
                    )}
                </nav>

                <div className="flex flex-col items-center gap-4 border-t border-[#222] pt-8 w-full">
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="text-primary font-black uppercase tracking-widest">Déconnexion</button>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-white font-black uppercase tracking-widest">Connexion</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-white font-black uppercase tracking-widest">S'inscrire</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;