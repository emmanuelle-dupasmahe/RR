// components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';

function Header() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
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

    useEffect(() => {
        const checkStandalone = () => {
            const standaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
            setIsStandalone(standaloneMode);
            if (standaloneMode) {
                setIsInstallable(false);
                setDeferredInstallPrompt(null);
            }
        };

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            checkStandalone();
            setDeferredInstallPrompt(e);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setIsInstallable(false);
            setDeferredInstallPrompt(null);
            setIsStandalone(true);
        };

        checkStandalone();
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const logoSrc = `${import.meta.env.BASE_URL}images/rr_trans.png`;
    // --------------------------

    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate(isAdmin ? '/login' : '/');
    };

    const handleInstallApp = async () => {
        if (!deferredInstallPrompt || isStandalone) return;
        deferredInstallPrompt.prompt();
        const result = await deferredInstallPrompt.userChoice;
        if (result?.outcome === 'accepted') {
            setIsInstallable(false);
        }
        setDeferredInstallPrompt(null);
    };

    const navLinkClass = ({ isActive }) =>
        `inline-flex shrink-0 whitespace-nowrap items-center justify-center text-center text-[1.1rem] lg:text-[0.82rem] xl:text-[0.95rem] font-[700] uppercase no-underline tracking-[1px] transition-colors duration-300 ${isActive
            ? 'text-black dark:text-white'
            : 'text-gray-500 dark:text-[#888888] hover:text-black dark:hover:text-white'
        }`;

    const backstageClass = ({ isActive }) =>
        `flex shrink-0 whitespace-nowrap items-center gap-2 text-[1.1rem] lg:text-[0.82rem] xl:text-[0.95rem] font-[700] uppercase no-underline tracking-[1px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-primary/60 hover:text-primary'
        }`;

    return (
        <header className="fixed top-0 left-0 z-[1000] w-full flex justify-between lg:justify-start items-center px-6 md:px-[40px] bg-white dark:bg-black h-[80px] transition-colors duration-300">

            {/* LOGO */}
            <Link to="/" className="flex items-center no-underline shrink-0">
                <img
                    src={logoSrc}
                    alt="Réservoir Rock Logo"
                    width="170"
                    height="110"
                    className="w-[130px] md:w-[155px] lg:w-[170px] h-auto transition-transform duration-200 animate-pulse"
                    style={theme === 'light' ? { filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.65)) drop-shadow(0 0 8px rgba(0,0,0,0.4))' } : {}}
                />
            </Link>

            {/* NAVIGATION DESKTOP */}
            <nav className="hidden lg:flex flex-nowrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:gap-[16px] xl:gap-[25px] items-center justify-center">
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
                
                {/* ── AJOUT CONCERTS ET AGENDA PROTÉGÉS ── */}
                {isAuthenticated && (user?.role === 'admin' || user?.role === 'member') && (
                    <>
                        <NavLink to="/concerts" className={navLinkClass}>Concerts</NavLink>
                        <NavLink to="/agenda" className={navLinkClass}>Agenda</NavLink>
                    </>
                )}
                
                <NavLink to="/livredor" className={navLinkClass}>Livre d'or</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

                {isAuthenticated && user?.role === 'admin' && (
                    <NavLink to="/dashboard" className={navLinkClass}>Admin</NavLink>
                )}
            </nav>

            {/* BLOC DROIT : TOGGLE THEME + AUTH */}
            <div className="flex items-center ml-auto gap-4">

                {isInstallable && !isStandalone && (
                    <>
                        <button
                            onClick={handleInstallApp}
                            className="hidden lg:inline-flex xl:hidden items-center justify-center h-9 w-9 rounded-lg bg-primary text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                            title="Installer l'application"
                            aria-label="Installer l'application"
                        >
                            <GetAppOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>

                        <button
                            onClick={handleInstallApp}
                            className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-[11px] font-black uppercase tracking-wider cursor-pointer"
                            title="Installer l'application"
                        >
                            <GetAppOutlinedIcon sx={{ fontSize: 16 }} />
                            Installer
                        </button>
                    </>
                )}

                {/* BOUTON TOGGLE THEME */}
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
                <div className="hidden lg:flex items-center justify-center text-center bg-black dark:bg-white px-[15px] py-[6px] lg:gap-[6px] xl:gap-[8px] whitespace-nowrap shrink-0 transition-colors">
                    {isAuthenticated ? (
                        <>
                            <span className="text-white dark:text-black lg:text-[0.58rem] xl:text-[0.65rem] font-[900] uppercase">{user?.firstname}</span>
                            <span className="text-white dark:text-black lg:text-[0.58rem] xl:text-[0.65rem] font-[900] uppercase">/</span>
                            <button onClick={handleLogout} className="bg-transparent text-white dark:text-black lg:text-[0.58rem] xl:text-[0.65rem] font-[900] uppercase cursor-pointer border-none hover:opacity-70 transition-opacity">Déconnexion</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-transparent text-white dark:text-black lg:text-[0.58rem] xl:text-[0.65rem] font-[900] uppercase no-underline">Connexion</Link>
                            <span className="text-white dark:text-black lg:text-[0.58rem] xl:text-[0.65rem] font-[900] uppercase">/</span>
                            <Link to="/register" className="bg-transparent text-white dark:text-black lg:text-[0.58rem] xl:text-[0.65rem] font-[900] uppercase no-underline">S'inscrire</Link>
                        </>
                    )}
                </div>
            </div>

            {/* BOUTON BURGER */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col justify-center items-center gap-1.5 z-[1100] bg-transparent border-none cursor-pointer ml-3"
            >
                <span className={`block w-8 h-0.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''} bg-black dark:bg-white`}></span>
                <span className={`block w-8 h-0.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''} bg-black dark:bg-white`}></span>
                <span className={`block w-8 h-0.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''} bg-black dark:bg-white`}></span>
            </button>

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
                    
                    {/* ── AJOUT CONCERTS ET AGENDA PROTÉGÉS ── */}
                    {isAuthenticated && (user?.role === 'admin' || user?.role === 'member') && (
                        <>
                            <NavLink to="/concerts" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Concerts</NavLink>
                            <NavLink to="/agenda" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Agenda</NavLink>
                        </>
                    )}
                    
                    <NavLink to="/livredor" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Livre d'or</NavLink>
                    <NavLink to="/contact" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Contact</NavLink>
                    
                    {isAuthenticated && user?.role === 'admin' && (
                        <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Admin</NavLink>
                    )}
                </nav>

                <div className="flex flex-col items-center gap-4 border-t border-gray-200 dark:border-[#222] pt-8 w-full">
                    {isInstallable && !isStandalone && (
                        <button
                            onClick={handleInstallApp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-[11px] font-black uppercase tracking-widest cursor-pointer"
                        >
                            <GetAppOutlinedIcon sx={{ fontSize: 16 }} />
                            Installer l'app
                        </button>
                    )}

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