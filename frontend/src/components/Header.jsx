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



    const navLinkClass = ({ isActive }) =>
        `text-[0.95rem] font-[700] uppercase no-underline tracking-[1px] transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#888888] hover:text-white'
        }`;

    const authLinkClass = "bg-transparent text-black text-[0.65rem] font-[900] uppercase no-underline tracking-[1px] transition-colors duration-300 hover:text-[#666666]";

    return (
        <header className="fixed top-0 left-0 z-[1000] w-full flex justify-start items-center px-[40px] bg-black border-b-2 border-[#222] h-[80px] box-border">
            <Link to="/" className="flex items-center no-underline w-[150px] shrink-0">
                <img
                    src="/images/logo_rr.png"
                    alt="Réservoir Rock Logo"
                    className="w-[80px] h-auto transition-transform duration-200 hover:scale-105"
                />
            </Link>

            <nav className="flex gap-[35px] ml-[30px]">
                <NavLink to="/legroupe" className={navLinkClass}>Le groupe</NavLink>
                <NavLink to="/repetition" className={navLinkClass}>Répétitions</NavLink>
                <NavLink to="/videos" className={navLinkClass}>Vidéos</NavLink>
                <NavLink to="/concerts" className={navLinkClass}>Concerts</NavLink>
                {isAuthenticated && <NavLink to="/dashboard" className={navLinkClass}>Admin</NavLink>}
            </nav>

            <div className="flex items-center bg-white px-[15px] py-[6px] ml-auto gap-[15px] whitespace-nowrap shrink-0">
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
        </header>
    );

}



export default Header;