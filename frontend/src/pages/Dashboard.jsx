import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function Dashboard() {
    const { user } = useAuth();
    const [concerts, setConcerts] = useState([]);
    const [formData, setFormData] = useState({ titre: '', date_concert: '', heure: '', lieu: '' });

    // Charger les concerts au démarrage et après chaque action
    const fetchConcerts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/concerts');
            const data = await res.json();
            setConcerts(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchConcerts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/concerts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            setFormData({ titre: '', date_concert: '', heure: '', lieu: '' });
            fetchConcerts(); // On rafraîchit la liste
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette date ?")) {
            await fetch(`http://localhost:5000/api/concerts/${id}`, { method: 'DELETE' });
            fetchConcerts(); // On rafraîchit la liste
        }
    };

    return (
        <div className="mt-[100px] max-w-[900px] mx-auto px-[20px] pb-[40px] text-white">
            <div className="text-center py-[48px]">
                <h1 className="text-[3rem] font-[900] uppercase text-white leading-tight">ADMINISTRATION</h1>
            </div>

            {/* FORMULAIRE D'AJOUT */}
            <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                <h2 className="text-primary uppercase mt-0 mb-[20px] font-bold text-xl">Ajouter un Concert</h2>
                <form onSubmit={handleSubmit} className="space-y-[10px]">
                    <input type="text" placeholder="VILLE" className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary" value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value.toUpperCase() })} required />
                    <div className="grid grid-cols-2 gap-[10px]">
                        <input type="date" className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary" value={formData.date_concert} onChange={(e) => setFormData({ ...formData, date_concert: e.target.value })} required />
                        <input type="time" className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary" value={formData.heure} onChange={(e) => setFormData({ ...formData, heure: e.target.value })} required />
                    </div>
                    <input type="text" placeholder="LIEU" className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary" value={formData.lieu} onChange={(e) => setFormData({ ...formData, lieu: e.target.value })} required />
                    <button type="submit" className="bg-primary text-white border-none p-[15px] font-bold uppercase cursor-pointer w-full transition-colors hover:bg-[#b8151b]">Publier la date</button>
                </form>
            </div>

            {/* LISTE DES CONCERTS EXISTANTS */}
            <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                <h2 className="text-primary uppercase mt-0 font-bold text-xl">Dates programmées</h2>
                <div className="mt-[20px] space-y-[15px]">
                    {concerts.map(c => (
                        <div key={c.id} className="flex justify-between items-center py-[15px] border-b border-[#222]">
                            <div>
                                <span className="text-primary font-bold">{new Date(c.date_concert).toLocaleDateString('fr-FR')}</span>
                                <span className="ml-[15px] font-bold">{c.titre}</span>
                                <p className="text-[12px] text-[#666] m-0">{c.lieu}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="bg-transparent border border-[#444] text-[#666] px-[10px] py-[5px] cursor-pointer text-[10px] hover:text-red-600 transition-colors"
                            >
                                SUPPRIMER
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;