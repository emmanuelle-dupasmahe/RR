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
        <div className="dashboard-container">
            <div className="media-header">
                <h1 style={{color: 'white', textAlign: 'center', fontSize: '3rem', fontWeight: '900'}}>ADMINISTRATION</h1>
            </div>

            {/* FORMULAIRE D'AJOUT */}
            <div className="admin-card">
                <h2>Ajouter un Concert</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                    <input type="text" placeholder="VILLE" value={formData.titre} onChange={(e) => setFormData({...formData, titre: e.target.value.toUpperCase()})} required />
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                        <input type="date" value={formData.date_concert} onChange={(e) => setFormData({...formData, date_concert: e.target.value})} required />
                        <input type="time" value={formData.heure} onChange={(e) => setFormData({...formData, heure: e.target.value})} required />
                    </div>
                    <input type="text" placeholder="LIEU" value={formData.lieu} onChange={(e) => setFormData({...formData, lieu: e.target.value})} required />
                    <button type="submit">Publier la date</button>
                </form>
            </div>

            {/* LISTE DES CONCERTS EXISTANTS */}
            <div className="admin-card">
                <h2>Dates programmées</h2>
                <div style={{marginTop: '20px'}}>
                    {concerts.map(c => (
                        <div key={c.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #222'}}>
                            <div>
                                <span style={{color: '#e31b23', fontWeight: 'bold'}}>{new Date(c.date_concert).toLocaleDateString('fr-FR')}</span>
                                <span style={{marginLeft: '15px', fontWeight: 'bold'}}>{c.titre}</span>
                                <p style={{fontSize: '12px', color: '#666', margin: 0}}>{c.lieu}</p>
                            </div>
                            <button 
                                onClick={() => handleDelete(c.id)}
                                style={{background: 'transparent', border: '1px solid #444', color: '#666', padding: '5px 10px', cursor: 'pointer', fontSize: '10px'}}
                                onMouseOver={(e) => e.target.style.color = 'red'}
                                onMouseOut={(e) => e.target.style.color = '#666'}
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