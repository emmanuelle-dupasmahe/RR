// components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // --- LOGIQUE DARK MODE ---
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved : 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.add('light');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };
    // --------------------------

    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate(isAdmin ? '/login' : '/');
    };

    const navLinkClass = ({ isActive }) =>
        `text-[1.1rem] lg:text-[0.95rem] font-[700] uppercase no-underline tracking-[1px] transition-colors duration-300 ${isActive
            ? 'text-black dark:text-white'
            : 'text-gray-500 dark:text-[#888888] hover:text-black dark:hover:text-white'
        }`;

    const backstageClass = ({ isActive }) =>
        `flex items-center gap-2 text-[1.1rem] lg:text-[0.95rem] font-[700] uppercase no-underline tracking-[1px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-primary/60 hover:text-primary'
        }`;

    return (
        <header className="fixed top-0 left-0 z-[1000] w-full flex justify-between lg:justify-start items-center px-6 md:px-[40px] bg-white dark:bg-black border-b-2 border-gray-200 dark:border-[#222] h-[80px] box-border transition-colors duration-300">

            {/* LOGO */}
            <Link to="/" className="flex items-center no-underline w-[120px] lg:w-[150px] shrink-0">
                <img
                    src="/images/rr_trans.png"
                    alt="Réservoir Rock Logo"
                    className="w-[90px] md:w-[110px] h-auto transition-transform duration-200 hover:scale-110 animate-pulse"
                    style={theme === 'light' ? { filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.5))' } : {}}
                />
            </Link>

            {/* BOUTON BURGER */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col justify-center items-center gap-1.5 z-[1100] bg-transparent border-none cursor-pointer"
            >
                <span className={`block w-8 h-0.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''} bg-black dark:bg-white`}></span>
                <span className={`block w-8 h-0.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''} bg-black dark:bg-white`}></span>
                <span className={`block w-8 h-0.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''} bg-black dark:bg-white`}></span>
            </button>

            {/* NAVIGATION DESKTOP */}
            <nav className="hidden lg:flex gap-[25px] ml-[15px] items-center">
                <NavLink to="/legroupe" className={navLinkClass}>Le groupe</NavLink>
                <NavLink to="/repetition" className={navLinkClass}>Répétitions</NavLink>

                {isAuthenticated && (user?.role === 'admin' || user?.role === 'member') && (
                    <NavLink to="/backstage" className={backstageClass}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Backstage
                    </NavLink>
                )}

                <NavLink to="/videos" className={navLinkClass}>Vidéos</NavLink>
                <NavLink to="/concerts" className={navLinkClass}>Concerts</NavLink>
                <NavLink to="/livredor" className={navLinkClass}>Livre d'or</NavLink>

                {isAuthenticated && user?.role === 'admin' && (
                    <NavLink to="/dashboard" className={navLinkClass}>Admin</NavLink>
                )}
            </nav>

            {/* BLOC DROIT : TOGGLE THEME + AUTH */}
            <div className="flex items-center ml-auto gap-4">

                {/* BOUTON TOGGLE THEME - MISE À JOUR ICI */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                    title={theme === 'dark' ? "Passer au mode clair" : "Passer au mode sombre"}
                >
                    {theme === 'dark' ? (
                        <LightModeIcon className="text-white !text-[20px]" />
                    ) : (
                        <DarkModeIcon className="text-black !text-[20px]" />
                    )}
                </button>

                {/* BLOC AUTH (Desktop) */}
                <div className="hidden lg:flex items-center bg-black dark:bg-white px-[15px] py-[6px] gap-[15px] whitespace-nowrap shrink-0 transition-colors">
                    {isAuthenticated ? (
                        <>
                            <span className="text-white dark:text-black text-[0.65rem] font-[900] uppercase">{user?.firstname}</span>
                            <button onClick={handleLogout} className="bg-transparent text-white dark:text-black text-[0.65rem] font-[900] uppercase cursor-pointer border-none hover:opacity-70 transition-opacity">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-transparent text-white dark:text-black text-[0.65rem] font-[900] uppercase no-underline">Connexion</Link>
                            <Link to="/register" className="bg-transparent text-white dark:text-black text-[0.65rem] font-[900] uppercase no-underline">S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>

            {/* MENU MOBILE */}
            <div className={`fixed inset-0 flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                } bg-white dark:bg-black`}>
                <nav className="flex flex-col items-center gap-8 mb-12">
                    <NavLink to="/legroupe" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Le groupe</NavLink>
                    <NavLink to="/repetition" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Répétitions</NavLink>
                    {isAuthenticated && (user?.role === 'admin' || user?.role === 'member') && (
                        <NavLink to="/backstage" onClick={() => setIsMenuOpen(false)} className={backstageClass}>Backstage</NavLink>
                    )}
                    <NavLink to="/videos" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Vidéos</NavLink>
                    <NavLink to="/concerts" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Concerts</NavLink>
                    <NavLink to="/livredor" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Livre d'or</NavLink>
                </nav>

                <div className="flex flex-col items-center gap-4 border-t border-gray-200 dark:border-[#222] pt-8 w-full">
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="text-primary font-black uppercase tracking-widest">Déconnexion</button>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-black dark:text-white font-black uppercase tracking-widest">Connexion</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-black dark:text-white font-black uppercase tracking-widest">S'inscrire</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;