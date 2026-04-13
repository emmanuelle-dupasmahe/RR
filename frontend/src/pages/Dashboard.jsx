import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function Dashboard() {
    const { user, token } = useAuth();
    const [concerts, setConcerts] = useState([]);
    const [concertPages, setConcertPages] = useState({ current: 1, total: 1 });
    const [formData, setFormData] = useState({ titre: '', date_concert: '', heure: '', lieu: '' });
    const [editingConcert, setEditingConcert] = useState(null);

    const [repetitions, setRepetitions] = useState([]);
    const [repPages, setRepPages] = useState({ current: 1, total: 1 });
    const [repFormData, setRepFormData] = useState({ titre: '', detail: '', url: '' });
    const [repFile, setRepFile] = useState(null);
    const [editingRep, setEditingRep] = useState(null);

    const [videos, setVideos] = useState([]);
    const [videoPages, setVideoPages] = useState({ current: 1, total: 1 });
    const [videoFormData, setVideoFormData] = useState({ titre: '', description: '', url_youtube: '' });
    const [videoFile, setVideoFile] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);

    const [tourTitle, setTourTitle] = useState('');

    const [groupMembers, setGroupMembers] = useState([]);
    const [editingMember, setEditingMember] = useState(null);
    const [groupTexts, setGroupTexts] = useState({
        group_slogan: '',
        group_announce: '',
        group_history_1: '',
        group_history_2: '',
        group_title_history: '',
        photo_credits: ''
    });
    const [newMember, setNewMember] = useState({ nom: '', instrument: '', photo_url: '', ordre_affichage: 0 });

    const [messages, setMessages] = useState([]);
    const [reponses, setReponses] = useState({}); // Objet pour stocker { messageId: "le texte" }

    const handleChangementReponse = (id, texte) => {
        setReponses(prev => ({ ...prev, [id]: texte }));
    };

    const [activeSection, setActiveSection] = useState('concerts');
    
    // --- LOGIQUE FETCH ---

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

        // Récupérer les membres
        fetch('http://localhost:5000/api/membres')
            .then(res => res.json())
            .then(setGroupMembers);

        // Récupérer les textes de Legroupe
        fetch('http://localhost:5000/api/groupesettings')
            .then(res => res.json())
            .then(setGroupTexts);

        // Récupérer les messages
        fetch('http://localhost:5000/api/guestbook/admin/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Erreur accès admin');
                return res.json();
            })
            .then(data => setMessages(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erreur livre d'or admin:", err));
    }, []);

    // --- HANDLERS ---
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
            fetchConcerts();
            alert('Concert publié !');
        } else {
            const errorData = await response.json();
            alert(`Erreur: ${errorData.error || "Échec de la publication"}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette date ?")) return;
        const res = await fetch(`http://localhost:5000/api/concerts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            fetchConcerts();
            alert('Date supprimée');
        } else {
            alert('Erreur lors de la suppression');
        }
    };

    const handleUpdateConcert = async (concert) => {
        // Préparation des données pour MySQL (nettoyage des formats)
        const payload = {
            titre: concert.titre,
            // On ne garde que la partie YYYY-MM-DD si c'est une date ISO
            date_concert: concert.date_concert.includes('T') ? concert.date_concert.split('T')[0] : concert.date_concert,
            // On s'assure d'envoyer l'heure au format HH:mm
            heure: concert.heure ? concert.heure.substring(0, 5) : '',
            lieu: concert.lieu
        };

        console.log("Données envoyées :", payload);
        try {
            const res = await fetch(`http://localhost:5000/api/concerts/${concert.id}`, {
                method: 'PUT', // On utilise PUT pour la mise à jour
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setEditingConcert(null); // ferme le mode édition
                fetchConcerts(); // liste raffraichit
                alert('Concert mis à jour avec succès !');
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible de mettre à jour'}`);
            }
        } catch (err) {
            console.error("Erreur update concert", err);
            alert("Erreur réseau lors de la mise à jour");
        }
    };

    const handleUpdateRep = async (rep) => {
        try {
            const res = await fetch(`http://localhost:5000/api/repetitions/${rep.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ titre: rep.titre, detail: rep.detail, url: rep.url })
            });
            if (res.ok) {
                setEditingRep(null);
                fetchRepetitions();
                alert('Morceau mis à jour');
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible de mettre à jour'}`);
            }
        } catch (err) { console.error(err); }
    };

    const handleUpdateVideo = async (video) => {
        try {
            const res = await fetch(`http://localhost:5000/api/videos/${video.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ titre: video.titre, description: video.description, url_youtube: video.url_youtube })
            });
            if (res.ok) {
                setEditingVideo(null);
                fetchVideos();
                alert('Vidéo mise à jour');
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible de mettre à jour'}`);
            }
        } catch (err) { console.error(err); }
    };

    const handleUpdateMember = async (member) => {
        try {
            const res = await fetch(`http://localhost:5000/api/membres/${member.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    nom: member.nom,
                    instrument: member.instrument,
                    photo_url: member.photo_url,
                    ordre_affichage: member.ordre_affichage
                })
            });
            if (res.ok) {
                setEditingMember(null);
                const updated = await fetch('http://localhost:5000/api/membres').then(r => r.json());
                setGroupMembers(updated);
                alert('Musicien mis à jour');
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible de mettre à jour'}`);
            }
        } catch (err) { console.error(err); }
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
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });
        if (response.ok) {
            setRepFormData({ titre: '', detail: '', url: '' });
            setRepFile(null);
            e.target.reset();
            fetchRepetitions();
            alert('Morceau ajouté au studio !');
        } else {
            const errorData = await response.json();
            alert(`Erreur: ${errorData.error || "Échec de l'ajout"}`);
        }
    };

    // Mettre à jour un texte (Slogan, etc.)
    const handleUpdateGroupText = async (key, value) => {
        try {
            await fetch('http://localhost:5000/api/groupesettings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key_name: key, value_text: value })
            });
        } catch (err) {
            console.error("Erreur de mise à jour du texte");
        }
    };

    // Ajouter un nouveau membre
    const handleAddMember = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/membres', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newMember)
        });
        if (res.ok) {
            // Rafraîchir la liste et vider le formulaire
            const updated = await fetch('http://localhost:5000/api/membres').then(r => r.json());
            setGroupMembers(updated);
            setNewMember({ nom: '', instrument: '', photo_url: '', ordre_affichage: 0 });
            alert('Musicien ajouté !');
        } else {
            const errorData = await res.json();
            alert(`Erreur: ${errorData.error || "Échec de l'ajout"}`);
        }
    };

    // Supprimer un nouveau membre
    const handleDeleteMember = async (id) => {
        if (!window.confirm("Supprimer ce membre du groupe ?")) return;

        const res = await fetch(`http://localhost:5000/api/membres/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        // Rafraîchir la liste
        if (res.ok) {
            setGroupMembers(groupMembers.filter(m => m.id !== id));
            alert('Membre supprimé');
        } else {
            alert('Erreur lors de la suppression');
        }
    };

    // Sauvegarder la réponse 
    const handleUpdateResponse = async (id, texte) => {
        try {
            const res = await fetch(`http://localhost:5000/api/guestbook/${id}/reponse`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reponse: texte })
            });

            if (res.ok) {
                alert("Réponse enregistrée avec succès !");
            } else {
                alert("Erreur lors de la sauvegarde sur le serveur.");
            }
        } catch (err) {
            console.error("Erreur login réponse:", err);
        }
    };

    // Supprimer un message
    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/guestbook/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRepDelete = async (id) => {
        if (!window.confirm("Supprimer ce morceau ?")) return;
        const res = await fetch(`http://localhost:5000/api/repetitions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            fetchRepetitions();
            alert('Morceau supprimé');
        } else {
            alert('Erreur lors de la suppression');
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
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });
        if (response.ok) {
            setVideoFormData({ titre: '', description: '', url_youtube: '' });
            setVideoFile(null);
            e.target.reset();
            fetchVideos();
            alert('Vidéo publiée !');
        } else {
            const errorData = await response.json();
            alert(`Erreur: ${errorData.error || "Échec de la publication"}`);
        }
    };

    const handleVideoDelete = async (id) => {
        if (!window.confirm("Supprimer cette vidéo ?")) return;
        const res = await fetch(`http://localhost:5000/api/videos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            fetchVideos();
            alert('Vidéo supprimée');
        } else {
            alert('Erreur lors de la suppression');
        }
    };

    // --- COMPOSANTS  ---
    const Pagination = ({ pages, onPageChange }) => (
        pages.total > 1 && (
            <div className="flex justify-center gap-4 mt-8">
                <button
                    disabled={pages.current === 1}
                    onClick={() => onPageChange(pages.current - 1)}
                    className="px-4 py-2 bg-black text-white text-[10px] uppercase font-black border border-white/10 hover:border-primary disabled:opacity-30 transition-all cursor-pointer"
                >
                    Précédent
                </button>
                <span className="text-[10px] font-bold self-center tracking-widest opacity-50">PAGE {pages.current} / {pages.total}</span>
                <button
                    disabled={pages.current === pages.total}
                    onClick={() => onPageChange(pages.current + 1)}
                    className="px-4 py-2 bg-black text-white text-[10px] uppercase font-black border border-white/10 hover:border-primary disabled:opacity-30 transition-all cursor-pointer"
                >
                    Suivant
                </button>
            </div>
        )
    );

    const SectionTitle = ({ children, subtitle }) => (
        <div className="mb-10">
            <h2 className="text-white text-2xl md:text-3xl font-[600] uppercase tracking-tightergit">
                {children} <span className="text-primary">.</span>
            </h2>
            {subtitle && <p className="text-primary font-black tracking-[4px] uppercase text-[0.65rem] mt-1 opacity-80">{subtitle}</p>}
        </div>
    );

    const inputClass = "w-full p-4 bg-[#0a0a0a] border border-white/5 text-white focus:outline-none focus:border-primary/50 placeholder:text-white/20 transition-all rounded-lg text-sm font-medium";
    const btnClass = "bg-primary text-white border-none p-4 font-black uppercase tracking-widest cursor-pointer w-full transition-all hover:bg-white hover:text-black rounded-lg shadow-lg active:scale-[0.98]";

    return (
        <div className="mt-[80px] min-h-screen bg-black text-white pb-20">
            {/* HEADER DASHBOARD */}
            <div className="text-center py-16 bg-gradient-to-b from-[#111] to-black px-4 mb-12 border-b border-white/5">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-white inline-block">
                    BackStage
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">Control Panel // Admin Only</p>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 space-y-24">

                {/* RÉGLAGES GÉNÉRAUX */}
                <section>
                    <SectionTitle subtitle="Global Settings">Tournée en cours</SectionTitle>
                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl shadow-2xl">
                        <form onSubmit={handleUpdateTitle} className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                className={inputClass}
                                value={tourTitle}
                                onChange={(e) => setTourTitle(e.target.value)}
                                placeholder="ex: TOURNÉE 2026"
                                required
                            />
                            <button type="submit" className="md:w-auto bg-white text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all rounded-lg">
                                Update
                            </button>
                        </form>
                    </div>
                </section>


                {/* SECTION CONCERTS */}
                <section>
                    <SectionTitle subtitle="Live Dates Management">Calendrier Concerts</SectionTitle>
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">Ajouter une date</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="VILLE" className={inputClass} value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value.toUpperCase() })} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="date" className={inputClass} value={formData.date_concert} onChange={(e) => setFormData({ ...formData, date_concert: e.target.value })} required />
                                    <input type="time" className={inputClass} value={formData.heure} onChange={(e) => setFormData({ ...formData, heure: e.target.value })} required />
                                </div>
                                <input type="text" placeholder="LIEU (NOM DE LA SALLE)" className={inputClass} value={formData.lieu} onChange={(e) => setFormData({ ...formData, lieu: e.target.value })} required />
                                <button type="submit" className={btnClass}>Publier la date</button>
                            </form>
                        </div>
                        {/* List */}
                        <div className="space-y-4">
                            {concerts.map(c => (
                                <div key={c.id} className="p-5 bg-[#0a0a0a] border border-white/5 rounded-xl">
                                    {editingConcert === c.id ? (
                                        /* --- MODE ÉDITION --- */
                                        <div className="space-y-3">
                                            <input
                                                className={inputClass}
                                                value={c.titre}
                                                onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, titre: e.target.value.toUpperCase() } : con))}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date" className={inputClass}
                                                    value={c.date_concert.split('T')[0]}
                                                    onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, date_concert: e.target.value } : con))}
                                                />
                                                <input
                                                    type="time" className={inputClass}
                                                    value={c.heure ? c.heure.substring(0, 5) : ""}
                                                    onChange={(e) => setConcerts(concerts.map(con =>
                                                        con.id === c.id ? { ...con, heure: e.target.value } : con))}
                                                />
                                            </div>
                                            <input
                                                className={inputClass}
                                                value={c.lieu}
                                                onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, lieu: e.target.value } : con))}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateConcert(c)} className="bg-green-600 text-white text-[10px] font-black p-2 rounded uppercase flex-1">Sauvegarder</button>
                                                <button onClick={() => setEditingConcert(null)} className="bg-white/10 text-white text-[10px] font-black p-2 rounded uppercase flex-1">Annuler</button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* --- MODE AFFICHAGE --- */
                                        <div className="group flex justify-between items-center">
                                            <div>
                                                <span className="text-primary font-black text-xs tracking-tighter uppercase block mb-1">
                                                    {new Date(c.date_concert).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-lg font-bold uppercase tracking-tight">{c.titre}</span>
                                                <p className="text-[11px] text-[#666] uppercase font-bold tracking-widest mt-1">{c.lieu}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setEditingConcert(c.id)} className="text-white/50 hover:text-white transition-all text-[10px] font-black uppercase">Edit</button>
                                                <button onClick={() => handleDelete(c.id)} className="text-[#444] hover:text-primary transition-all text-[10px] font-black uppercase">Delete</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Pagination pages={concertPages} onPageChange={fetchConcerts} />
                        </div>
                    </div>
                </section>

                {/* SECTION RÉPÉTITIONS */}
                <section className="pt-12 border-t border-white/5">
                    <SectionTitle subtitle="Audio Archives">Répètes</SectionTitle>
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Formulaire */}
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">Ajouter un morceau</h3>
                            <form onSubmit={handleRepSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="TITRE (ex: ATOMIC CITY)"
                                    className={inputClass}
                                    value={repFormData.titre}
                                    onChange={(e) => setRepFormData({ ...repFormData, titre: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="DÉTAIL (ex: Session Live 12.02)"
                                    className={inputClass}
                                    value={repFormData.detail}
                                    onChange={(e) => setRepFormData({ ...repFormData, detail: e.target.value })}
                                    required
                                />

                                {/* Champ URL */}
                                <input
                                    type="text"
                                    placeholder="URL AUDIO (ex: https://dropbox.com/mon-son.mp3)"
                                    className={inputClass}
                                    value={repFormData.url}
                                    onChange={(e) => setRepFormData({ ...repFormData, url: e.target.value })}
                                />

                                <div className="text-center text-[10px] font-black uppercase opacity-20 py-2">— OU —</div>

                                {/* Upload Fichier */}
                                <div className="p-4 border-2 border-dashed border-white/5 rounded-lg text-center hover:border-primary/30 transition-all">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        className="hidden"
                                        id="audio-upload"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setRepFile(file);
                                                // Remplissage auto du titre si vide
                                                if (!repFormData.titre) {
                                                    const fileName = file.name.split('.').slice(0, -1).join('.');
                                                    setRepFormData(prev => ({ ...prev, titre: fileName.toUpperCase() }));
                                                }
                                            }
                                        }}
                                    />
                                    <label htmlFor="audio-upload" className="cursor-pointer text-[10px] font-black uppercase tracking-[2px] text-[#666] hover:text-white">
                                        {repFile ? repFile.name : "Cliquez pour uploader un MP3"}
                                    </label>
                                </div>

                                <button type="submit" className={btnClass}>Ajouter au studio</button>
                            </form>
                        </div>

                        {/* Liste */}
                        <div className="space-y-4">
                            {repetitions.map(r => (
                                <div key={r.id} className="p-5 bg-[#0a0a0a] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                    {editingRep === r.id ? (
                                        <div className="space-y-2">
                                            <input className={inputClass} value={r.titre} onChange={(e) => setRepetitions(repetitions.map(item => item.id === r.id ? { ...item, titre: e.target.value } : item))} />
                                            <input className={inputClass} value={r.detail} onChange={(e) => setRepetitions(repetitions.map(item => item.id === r.id ? { ...item, detail: e.target.value } : item))} />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateRep(r)} className="bg-green-600 text-[10px] font-black p-2 rounded flex-1">OK</button>
                                                <button onClick={() => setEditingRep(null)} className="bg-white/10 text-[10px] font-black p-2 rounded flex-1">X</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-white font-bold block uppercase tracking-tight">{r.titre}</span>
                                                    <span className="text-[11px] text-[#666] font-bold uppercase">{r.detail}</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => setEditingRep(r.id)} className="text-white/30 hover:text-white text-[10px] font-black uppercase">Edit</button>
                                                    <button onClick={() => handleRepDelete(r.id)} className="text-[#444] hover:text-primary text-[10px] font-black uppercase">Delete</button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <audio src={r.url.startsWith('/uploads') ? `http://localhost:5000${r.url}` : r.url} controls className="h-8 w-full opacity-40 hover:opacity-100 transition-all invert" />
                                </div>
                            ))}
                            <Pagination pages={repPages} onPageChange={fetchRepetitions} />
                        </div>
                    </div>
                </section>

                {/* SECTION VIDÉOS */}
                <section className="pt-12 border-t border-white/5">
                    <SectionTitle subtitle="Visual Content">Vidéos</SectionTitle>
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Formulaire */}
                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">Nouvelle Vidéo</h3>
                            <form onSubmit={handleVideoSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="TITRE"
                                    className={inputClass}
                                    value={videoFormData.titre}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, titre: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="DESCRIPTION / LIEU"
                                    className={inputClass}
                                    value={videoFormData.description}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                                />

                                {/* Option 1: URL Youtube */}
                                <input
                                    type="text"
                                    placeholder="ID YOUTUBE (ex: UrrtAPj9Nzw)"
                                    className={inputClass}
                                    value={videoFormData.url_youtube}
                                    onChange={(e) => setVideoFormData({ ...videoFormData, url_youtube: e.target.value })}
                                />

                                <div className="text-center text-[10px] font-black uppercase opacity-20 py-2">— OU —</div>

                                {/* Option 2: Upload Fichier Vidéo */}
                                <div className="p-4 border-2 border-dashed border-white/5 rounded-lg text-center hover:border-primary/30 transition-all">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        id="video-upload"
                                        onChange={(e) => setVideoFile(e.target.files[0])}
                                    />
                                    <label htmlFor="video-upload" className="cursor-pointer text-[10px] font-black uppercase tracking-[2px] text-[#666] hover:text-white">
                                        {videoFile ? videoFile.name : "Uploader un fichier vidéo (MP4...)"}
                                    </label>
                                </div>

                                <button type="submit" className={btnClass}>Publier la vidéo</button>
                            </form>
                        </div>

                        {/* Liste des vidéos */}
                        <div className="space-y-4">
                            {videos.map(v => (
                                <div key={v.id} className="flex justify-between items-center p-5 bg-[#0a0a0a] border border-white/5 rounded-xl">
                                    {editingVideo === v.id ? (
                                        <div className="flex-1 flex flex-col gap-2"> {/* Passage en flex-col pour plus d'espace */}
                                            {/* Champ TITRE */}
                                            <input
                                                className={inputClass}
                                                value={v.titre}
                                                onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, titre: e.target.value } : item))}
                                                placeholder="Titre"
                                            />

                                            {/* Champ DESCRIPTION (Lieu) */}
                                            <input
                                                className={inputClass}
                                                value={v.description || ''}
                                                onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, description: e.target.value } : item))}
                                                placeholder="Lieu (ex: SIX-FOURS)"
                                            />

                                            {/* Champ URL (Youtube) */}
                                            <input
                                                className={inputClass}
                                                value={v.url_youtube || ''}
                                                onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, url_youtube: e.target.value } : item))}
                                                placeholder="ID Youtube"
                                            />

                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => handleUpdateVideo(v)} className="bg-green-600 px-3 py-1 rounded font-black text-xs">OK</button>
                                                <button onClick={() => setEditingVideo(null)} className="bg-white/10 px-3 py-1 rounded font-black text-xs">X</button>
                                            </div>
                                        </div>
                                    ) : (

                                        <>
                                            <div>
                                                <span className="text-white font-bold block uppercase tracking-tight">{v.titre}</span>
                                                <span className="text-[11px] text-[#666] font-bold uppercase tracking-widest">
                                                    {v.description} {v.url_youtube ? "(Youtube)" : "(Fichier)"}
                                                </span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setEditingVideo(v.id)} className="text-white/30 hover:text-white text-[10px] font-black uppercase">Edit</button>
                                                <button onClick={() => handleVideoDelete(v.id)} className="text-[#444] hover:text-primary text-[10px] font-black uppercase tracking-widest">
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <Pagination pages={videoPages} onPageChange={fetchVideos} />
                        </div>
                    </div>
                </section>

                {/* --- SECTION LE GROUPE --- */}
                <section className="pt-12 border-t border-white/5">
                    <SectionTitle subtitle="Band Identity">Le Groupe</SectionTitle>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-8">

                        {/* Ligne : Annonce et Slogan */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Annonce (Tribute...)</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={groupTexts.group_announce || ''}
                                    onChange={(e) => setGroupTexts({ ...groupTexts, group_announce: e.target.value })}
                                    onBlur={() => handleUpdateGroupText('group_announce', groupTexts.group_announce)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Slogan de la page</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={groupTexts.group_slogan || ''}
                                    onChange={(e) => setGroupTexts({ ...groupTexts, group_slogan: e.target.value })}
                                    onBlur={() => handleUpdateGroupText('group_slogan', groupTexts.group_slogan)}
                                />
                            </div>
                        </div>

                        {/* Nouveau : Titre de la section Histoire */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Titre de la section Histoire (ex: "Our Story")</label>
                            <input
                                type="text"
                                className={inputClass}
                                value={groupTexts.group_title_history || ''}
                                onChange={(e) => setGroupTexts({ ...groupTexts, group_title_history: e.target.value })}
                                onBlur={() => handleUpdateGroupText('group_title_history', groupTexts.group_title_history)}
                                placeholder="L'histoire du groupe..."
                            />
                        </div>

                        {/* Ligne : Histoire (2 colonnes) */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Histoire (Colonne Gauche)</label>
                                <textarea
                                    className={`${inputClass} min-h-[150px] leading-relaxed`}
                                    value={groupTexts.group_history_1 || ''}
                                    onChange={(e) => setGroupTexts({ ...groupTexts, group_history_1: e.target.value })}
                                    onBlur={() => handleUpdateGroupText('group_history_1', groupTexts.group_history_1)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Histoire (Colonne Droite)</label>
                                <textarea
                                    className={`${inputClass} min-h-[150px] leading-relaxed`}
                                    value={groupTexts.group_history_2 || ''}
                                    onChange={(e) => setGroupTexts({ ...groupTexts, group_history_2: e.target.value })}
                                    onBlur={() => handleUpdateGroupText('group_history_2', groupTexts.group_history_2)}
                                />
                            </div>
                            {/* Ligne : Crédits Photos */}
                            <div className="space-y-2 pt-4 border-t border-white/5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary block">
                                    Crédits Photographiques (Footer)
                                </label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={groupTexts.photo_credits || ''}
                                    onChange={(e) => setGroupTexts({ ...groupTexts, photo_credits: e.target.value })}
                                    onBlur={() => handleUpdateGroupText('photo_credits', groupTexts.photo_credits)}
                                    placeholder="Mika / Reservoir Rock..."
                                />
                                <p className="text-[9px] text-gray-500 uppercase tracking-tighter">
                                    Ce texte s'affiche en bas de toutes les pages du site.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION MUSICIENS --- */}
                <section className="pt-12 border-t border-white/5">
                    <SectionTitle subtitle="Band Members">Gestion des Musiciens</SectionTitle>

                    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl">
                        {/* Formulaire d'ajout amélioré */}
                        <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 p-6 bg-white/5 rounded-xl border border-white/5">
                            <input
                                type="text" placeholder="Nom du musicien"
                                className={inputClass}
                                value={newMember.nom}
                                onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
                                required
                            />
                            <input
                                type="text" placeholder="Instrument (ex: Guitar)"
                                className={inputClass}
                                value={newMember.instrument}
                                onChange={(e) => setNewMember({ ...newMember, instrument: e.target.value })}
                                required
                            />
                            <input
                                type="text" placeholder="URL de la photo"
                                className={inputClass}
                                value={newMember.photo_url}
                                onChange={(e) => setNewMember({ ...newMember, photo_url: e.target.value })}
                            />
                            <button type="submit" className={btnClass}>Ajouter au groupe</button>
                        </form>

                        {/* Liste des membres avec Edition complète */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {groupMembers.map(m => (
                                <div key={m.id} className="relative p-5 bg-black border border-white/10 rounded-xl hover:border-primary/30 transition-all group">
                                    {editingMember === m.id ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full bg-white/5 border border-white/10 p-2 text-xs rounded text-white"
                                                value={m.nom}
                                                onChange={(e) => setGroupMembers(groupMembers.map(item => item.id === m.id ? { ...item, nom: e.target.value } : item))}
                                            />
                                            <input
                                                className="w-full bg-white/5 border border-white/10 p-2 text-xs rounded text-primary"
                                                value={m.instrument}
                                                onChange={(e) => setGroupMembers(groupMembers.map(item => item.id === m.id ? { ...item, instrument: e.target.value } : item))}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleUpdateMember(m)} className="bg-primary/20 text-primary px-3 py-1 rounded text-[10px] font-black uppercase hover:bg-primary hover:text-black">Save</button>
                                                <button onClick={() => setEditingMember(null)} className="text-white/50 text-[10px] font-black uppercase underline">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditingMember(m.id)} className="text-white/40 hover:text-white text-[10px]">Modifier</button>
                                                <button onClick={() => handleDeleteMember(m.id)} className="text-white/40 hover:text-red-500 text-[10px]">Supprimer</button>
                                            </div>

                                            {/* Visualisation rapide de la photo si elle existe */}
                                            <div className="flex items-center gap-4">
                                                {m.photo_url && (
                                                    <img src={m.photo_url} alt={m.nom} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                )}
                                                <div>
                                                    <p className="text-white font-bold uppercase tracking-tight leading-none">{m.nom}</p>
                                                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">{m.instrument}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SECTION LIVRE D'OR --- */}
                <section className="pt-12 border-t border-white/5">
                    <SectionTitle subtitle="Fan Messages">Livre d'Or</SectionTitle>

                    <div className="space-y-4">
                        {Array.isArray(messages) && messages.length > 0 ? (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`bg-[#0a0a0a] border ${msg.is_private ? 'border-primary/40 shadow-[0_0_15px_rgba(255,0,0,0.1)]' : 'border-white/5'} p-6 rounded-2xl transition-all`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-primary text-[10px] font-black uppercase tracking-widest block">
                                                    Par {msg.firstname || `Utilisateur #${msg.user_id}`} — {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'Date inconnue'}
                                                </span>

                                                {msg.is_private === 1 && (
                                                    <>
                                                        <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                                                            MESSAGE PRIVÉ
                                                        </span>
                                                        {/* AFFICHAGE DE L'EMAIL ICI */}
                                                        <span className="text-white/60 text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 select-all" title="Cliquez pour copier">
                                                            {msg.email || 'Email non trouvé'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-white text-sm italic">"{msg.content}"</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="text-white/20 hover:text-red-500 transition-colors text-[10px] font-black uppercase"
                                        >
                                            Supprimer
                                        </button>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                                {msg.is_private ? 'Note interne ou brouillon de réponse' : 'Réponse publique sur le site'}
                                            </label>

                                            <textarea
                                                className={`${inputClass} min-h-[80px] text-sm`}
                                                placeholder={msg.is_private ? `L'adresse est ${msg.email}. Notez ici si vous avez répondu...` : "Votre réponse publique..."}
                                                value={msg.reponse || ''}
                                                onChange={(e) => {
                                                    const nouveauTexte = e.target.value;
                                                    setMessages(messages.map(m => m.id === msg.id ? { ...m, reponse: nouveauTexte } : m));
                                                }}
                                            />

                                            <div className="flex justify-between items-center">
                                                {/* Petit lien discret pour ceux qui utilisent le webmail */}
                                                {msg.is_private === 1 && (
                                                    <span className="text-[9px] text-white/30 uppercase font-bold">
                                                        Copiez l'email ci-dessus pour répondre
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleUpdateResponse(msg.id, msg.reponse)}
                                                    className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/5 text-[10px] font-black uppercase transition-all ml-auto"
                                                >
                                                    Enregistrer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/30 text-[10px] uppercase tracking-widest text-center py-8">
                                Aucun message dans le livre d'or
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;