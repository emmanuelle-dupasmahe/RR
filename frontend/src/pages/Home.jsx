// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] flex flex-col justify-center items-center text-center bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.8)),url('/images/groupe.jpg')] bg-no-repeat bg-center bg-cover">
            <h1 className="text-[4rem] md:text-[6rem] font-[950] uppercase m-0 leading-[0.85] tracking-[-3px] text-white">
                Réservoir Rock
            </h1>

            <section className="bg-[rgba(227,27,35,0.4)] border border-primary px-[40px] py-[20px] mt-[60px] rounded-[4px]">
                <h2 className="text-[1.875rem] font-[900] uppercase mb-[8px] text-white">Prochain Concert</h2>
                <p className="text-white text-[1rem] leading-[1.5]">Le samedi 9 mai 2026 à Sanary pour Just Rosé 14h</p>
            </section>
        </div>
    );
}

export default Home;