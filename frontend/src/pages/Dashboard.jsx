import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function Dashboard() {
    const { user, token } = useAuth();
    const [concerts, setConcerts] = useState([]);
    const [concertPages, setConcertPages] = useState({ current: 1, total: 1 });
    const [formData, setFormData] = useState({ titre: '', date_concert: '', heure: '', lieu: '' });

    const [repetitions, setRepetitions] = useState([]);
    const [repPages, setRepPages] = useState({ current: 1, total: 1 });
    const [repFormData, setRepFormData] = useState({ titre: '', detail: '', url: '' });
    const [repFile, setRepFile] = useState(null);

    const [videos, setVideos] = useState([]);
    const [videoPages, setVideoPages] = useState({ current: 1, total: 1 });
    const [videoFormData, setVideoFormData] = useState({ titre: '', description: '', url_youtube: '' });
    const [videoFile, setVideoFile] = useState(null);

    const [tourTitle, setTourTitle] = useState('');

    const fetchRepetitions = async (page = 1) => {
        try {
            const res = await fetch(`http://localhost:5000/api/repetitions?page=${page}&limit=5`);
            const data = await res.json();
            setRepetitions(data.repetitions || []);
            setRepPages({ current: data.currentPage, total: data.totalPages });
        } catch (err) { console.error(err); }
    };

    const fetchConcerts = async (page = 1) => {
        try {
            const res = await fetch(`http://localhost:5000/api/concerts?page=${page}&limit=5`);
            const data = await res.json();
            setConcerts(data.concerts || []);
            setConcertPages({ current: data.currentPage, total: data.totalPages });
        } catch (err) { console.error(err); }
    };

    const fetchVideos = async (page = 1) => {
        try {
            const res = await fetch(`http://localhost:5000/api/videos?page=${page}&limit=5`);
            const data = await res.json();
            setVideos(data.videos || []);
            setVideoPages({ current: data.currentPage, total: data.totalPages });
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchConcerts();
        fetchRepetitions();
        fetchVideos();
        fetch('http://localhost:5000/api/settings/tour_title')
            .then(res => res.json())
            .then(data => setTourTitle(data.value || ''));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/concerts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            setFormData({ titre: '', date_concert: '', heure: '', lieu: '' });
            fetchConcerts(); // On rafraîchit la liste
        } else {
            const errorData = await response.json();
            alert(`Erreur : ${errorData.error}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette date ?")) {
            await fetch(`http://localhost:5000/api/concerts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchConcerts(); // On rafraîchit la liste
        }
    };
    const handleRepSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', repFormData.titre);
        data.append('detail', repFormData.detail);
        data.append('url', repFormData.url);
        if (repFile) data.append('audio', repFile);

        const response = await fetch('http://localhost:5000/api/repetitions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        });
        if (response.ok) {
            setRepFormData({ titre: '', detail: '', url: '' });
            setRepFile(null);
            e.target.reset();
            fetchRepetitions();
        }
    };

    // Fonction pour supprimer une répétition
    const handleRepDelete = async (id) => {
        if (window.confirm("Supprimer ce morceau ?")) {
            await fetch(`http://localhost:5000/api/repetitions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchRepetitions();
        }
    };

    const handleUpdateTitle = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/settings/tour_title', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ value: tourTitle })
        });
        if (res.ok) alert('Titre de la tournée mis à jour !');
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', videoFormData.titre);
        data.append('description', videoFormData.description);
        data.append('url_youtube', videoFormData.url_youtube);
        if (videoFile) data.append('video', videoFile);

        const response = await fetch('http://localhost:5000/api/videos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        });
        if (response.ok) {
            setVideoFormData({ titre: '', description: '', url_youtube: '' });
            setVideoFile(null);
            e.target.reset();
            fetchVideos();
        }
    };

    const handleVideoDelete = async (id) => {
        if (window.confirm("Supprimer cette vidéo ?")) {
            await fetch(`http://localhost:5000/api/videos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchVideos();
        }
    };

    const Pagination = ({ pages, onPageChange }) => (
        pages.total > 1 && (
            <div className="flex justify-center gap-2 mt-4">
                <button disabled={pages.current === 1} onClick={() => onPageChange(pages.current - 1)} className="px-3 py-1 bg-[#222] disabled:opacity-50 text-xs uppercase font-bold border border-[#444]">Précédent</button>
                <span className="text-xs self-center">Page {pages.current} / {pages.total}</span>
                <button disabled={pages.current === pages.total} onClick={() => onPageChange(pages.current + 1)} className="px-3 py-1 bg-[#222] disabled:opacity-50 text-xs uppercase font-bold border border-[#444]">Suivant</button>
            </div>
        )
    );

    return (
        <div className="mt-[100px] max-w-[900px] mx-auto px-[20px] pb-[40px] text-white">
            <div className="text-center py-[48px]">
                <h1 className="text-[3rem] font-[900] uppercase text-primary leading-tight">ADMINISTRATION</h1>
            </div>

            {/* RÉGLAGES GÉNÉRAUX */}
            <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                <h2 className="text-primary uppercase mt-0 mb-[20px] font-bold text-xl">Nom de la tournée</h2>
                <form onSubmit={handleUpdateTitle} className="flex gap-[10px]">
                    <input
                        type="text"
                        className="flex-1 p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary uppercase font-bold"
                        value={tourTitle}
                        onChange={(e) => setTourTitle(e.target.value)}
                        placeholder="ex: TOURNÉE 2026"
                        required
                    />
                    <button type="submit" className="bg-primary text-white border-none px-[25px] font-bold uppercase cursor-pointer hover:bg-[#b8151b] transition-colors">
                        Enregistrer
                    </button>
                </form>
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
                    <Pagination pages={concertPages} onPageChange={fetchConcerts} />
                </div>
            </div>
            {/* --- SECTION RÉPÉTITIONS --- */}
            <div className="border-t border-[#333] pt-[40px] mt-[40px]">
                <h1 className="text-[3rem] font-[900] uppercase text-white leading-tight text-center mb-[40px]">STUDIO RÉPÈTES</h1>

                {/* FORMULAIRE D'AJOUT RÉPÉTITION */}
                <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                    <h2 className="text-primary uppercase mt-0 mb-[20px] font-bold text-xl">Ajouter un Morceau</h2>
                    <form onSubmit={handleRepSubmit} className="space-y-[10px]">
                        <input
                            type="text"
                            placeholder="TITRE DU MORCEAU (ex: ATOMIC CITY - U2)"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary"
                            value={repFormData.titre}
                            onChange={(e) => setRepFormData({ ...repFormData, titre: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="DÉTAIL (ex: Répète du 12 Février 2026)"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary"
                            value={repFormData.detail}
                            onChange={(e) => setRepFormData({ ...repFormData, detail: e.target.value })}
                            required
                        />
                        <input
                            type="file"
                            accept="audio/*"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-[#9ca3af]"
                            onChange={(e) => setRepFile(e.target.files[0])}
                        />
                        <input
                            type="text"
                            placeholder="CHEMIN DU FICHIER AUDIO (ex: /audio/mon_morceau.mp3)"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-[#9ca3af] focus:outline-none focus:border-primary"
                            value={repFormData.url}
                            onChange={(e) => setRepFormData({ ...repFormData, url: e.target.value })}
                            required={!repFile}
                        />
                        <button type="submit" className="bg-primary text-white border-none p-[15px] font-bold uppercase cursor-pointer w-full transition-colors hover:bg-[#b8151b]">
                            Ajouter le morceau
                        </button>
                    </form>
                </div>

                {/* LISTE DES RÉPÉTITIONS EXISTANTES */}
                <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                    <h2 className="text-primary uppercase mt-0 font-bold text-xl">Morceaux en ligne</h2>
                    <div className="mt-[20px] space-y-[15px]">
                        {repetitions.map(r => (
                            <div key={r.id} className="flex justify-between items-center py-[15px] border-b border-[#222]">
                                <div className="flex-1">
                                    <span className="text-white font-bold block">{r.titre}</span>
                                    <span className="text-[12px] text-[#666]">{r.detail}</span>
                                    <p className="text-[10px] text-primary italic truncate max-w-[300px]">{r.url}</p>
                                </div>
                                {/* Ajout d'un petit lecteur pour vérifier l'upload */}
                                <audio
                                    src={r.url.startsWith('/uploads') ? `http://localhost:5000${r.url}` : r.url}
                                    controls
                                    className="h-8 w-40 md:w-48 ml-4"
                                />
                                <button
                                    onClick={() => handleRepDelete(r.id)}
                                    className="bg-transparent border border-[#444] text-[#666] px-[10px] py-[5px] cursor-pointer text-[10px] hover:text-red-600 transition-colors ml-4"
                                >
                                    SUPPRIMER
                                </button>
                            </div>
                        ))}
                        <Pagination pages={repPages} onPageChange={fetchRepetitions} />
                    </div>
                </div>
            </div>

            {/* --- SECTION VIDÉOS --- */}
            <div className="border-t border-[#333] pt-[40px] mt-[40px]">
                <h1 className="text-[3rem] font-[900] uppercase text-white leading-tight text-center mb-[40px]">GESTION VIDÉOS</h1>

                <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                    <h2 className="text-primary uppercase mt-0 mb-[20px] font-bold text-xl">Ajouter une Vidéo</h2>
                    <form onSubmit={handleVideoSubmit} className="space-y-[10px]">
                        <input
                            type="text"
                            placeholder="TITRE DE LA VIDÉO"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary"
                            value={videoFormData.titre}
                            onChange={(e) => setVideoFormData({ ...videoFormData, titre: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="DESCRIPTION / LIEU"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary"
                            value={videoFormData.description}
                            onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="ID YOUTUBE (ex: UrrtAPj9Nzw)"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary"
                            value={videoFormData.url_youtube}
                            onChange={(e) => setVideoFormData({ ...videoFormData, url_youtube: e.target.value })}
                        />
                        <div className="text-xs text-[#666] italic">OU uploader un fichier :</div>
                        <input
                            type="file"
                            accept="video/*"
                            className="w-full p-[12px] bg-[#222] border border-[#444] text-[#9ca3af]"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                        />
                        <button type="submit" className="bg-primary text-white border-none p-[15px] font-bold uppercase cursor-pointer w-full transition-colors hover:bg-[#b8151b]">
                            Ajouter la vidéo
                        </button>
                    </form>
                </div>

                <div className="bg-[#111] border border-[#333] p-[30px] mb-[30px] rounded-[4px]">
                    <h2 className="text-primary uppercase mt-0 font-bold text-xl">Vidéos en ligne</h2>
                    <div className="mt-[20px] space-y-[15px]">
                        {videos.map(v => (
                            <div key={v.id} className="flex justify-between items-center py-[15px] border-b border-[#222]">
                                <div className="flex-1">
                                    <span className="text-white font-bold block">{v.titre}</span>
                                    <span className="text-[12px] text-[#666]">{v.description}</span>
                                    <p className="text-[10px] text-primary italic truncate max-w-[300px]">{v.url_youtube || v.file_path}</p>
                                </div>
                                <button
                                    onClick={() => handleVideoDelete(v.id)}
                                    className="bg-transparent border border-[#444] text-[#666] px-[10px] py-[5px] cursor-pointer text-[10px] hover:text-red-600 transition-colors ml-4"
                                >
                                    SUPPRIMER
                                </button>
                            </div>
                        ))}
                        <Pagination pages={videoPages} onPageChange={fetchVideos} />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Dashboard;