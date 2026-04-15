import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import WavePlayer from '../components/WavePlayer';


function Dashboard() {
    const { user, token } = useAuth();
    const [concerts, setConcerts] = useState([]);
    const [concertPages, setConcertPages] = useState({ current: 1, total: 1 });
    const [formData, setFormData] = useState({ titre: '', date_concert: '', heure: '', lieu: '' });
    const [editingConcert, setEditingConcert] = useState(null);

    const [repetitions, setRepetitions] = useState([]);
    const [repPages, setRepPages] = useState({ current: 1, total: 1 });
    const [repFormData, setRepFormData] = useState({ titre: '', detail: '', url: '', start_time: 0, end_time: '', status: 'private' });
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

    const [activeSection, setActiveSection] = useState('tournee');

    const [markers, setMarkers] = useState([]);
    const [newMarker, setNewMarker] = useState({ time: '', label: '' });

    const [updateFile, setUpdateFile] = useState(null);

    // --- LOGIQUE FETCH ---

    const fetchRepetitions = async (page = 1) => {
        try {

            const token = localStorage.getItem('token');

            const res = await fetch(`http://localhost:5000/api/repetitions?page=${page}&limit=5`, {
                method: 'GET',

                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (res.ok) {
                setRepetitions(data.repetitions || []);
                setRepPages({ current: data.currentPage, total: data.totalPages });
            } else {
                console.error("Erreur serveur:", data.error);
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
        }
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


    const addMarker = () => {
        if (newMarker.time !== '' && newMarker.label !== '') {
            const updated = [...markers, { ...newMarker, time: Number(newMarker.time) }]
                .sort((a, b) => a.time - b.time); // Trie par temps
            setMarkers(updated);
            setNewMarker({ time: '', label: '' }); // Reset le petit formulaire
        }
    };

    const removeMarker = (index) => {
        setMarkers(markers.filter((_, i) => i !== index));
    };

    const jumpToTime = (repId, time) => {

        const eventName = `jump-to-${String(repId).replace('wave-', '')}`;
        const event = new CustomEvent(eventName, { detail: time });
        window.dispatchEvent(event);
    };

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

    //MODIFICATION REPETES
    const handleRepUpdate = async (rep, selectedFile) => { // Ajoute selectedFile en argument
        try {
            const formData = new FormData();
            formData.append('titre', rep.titre);
            formData.append('detail', rep.detail);
            formData.append('url', rep.url); // On garde l'ancienne au cas où pas de nouveau fichier
            formData.append('start_time', rep.start_time);
            formData.append('end_time', rep.end_time);
            formData.append('status', rep.status);

            const markersData = typeof markers === 'string' ? markers : JSON.stringify(markers);
            formData.append('markers', markersData);

            // SI l'utilisateur a sélectionné un nouveau fichier dans l'input
            if (selectedFile) {
                formData.append('audio', selectedFile);
            }

            const res = await fetch(`http://localhost:5000/api/repetitions/${rep.id}`, {
                method: 'PUT',
                headers: {

                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                setEditingRep(null);
                setUpdateFile(null);
                setMarkers([]);
                fetchRepetitions();
                alert('Morceau mis à jour');
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible de mettre à jour'}`);
            }
        } catch (err) {
            console.error("Erreur update:", err);
        }
    };


    //modification vidéos
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

    //modification membres
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

    //REPETITIONS
    const handleRepSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', repFormData.titre);
        data.append('detail', repFormData.detail);
        data.append('url', repFormData.url);
        data.append('start_time', repFormData.start_time);
        data.append('end_time', repFormData.end_time);
        data.append('status', repFormData.status || 'private');
        data.append('markers', JSON.stringify(markers));

        if (repFile) data.append('audio', repFile);

        const response = await fetch('http://localhost:5000/api/repetitions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });
        if (response.ok) {
            setRepFormData({ titre: '', detail: '', url: '' });
            setRepFile(null);
            setMarkers([]);
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

    //suppression repetes
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

    //modification tournée
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
            <h2 className="text-black dark:text-white text-2xl md:text-3xl font-[600] uppercase tracking-tighter">
                {children} <span className="text-[#e3181f]">.</span>
            </h2>
            {subtitle && (
                <p className="text-[#e3181f] font-black tracking-[4px] uppercase text-[0.65rem] mt-1 opacity-80">
                    {subtitle}
                </p>
            )}
        </div>
    );

    const inputClass = "w-full p-4 bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/5 text-black dark:text-white focus:outline-none focus:border-[#e3181f]/50 placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all rounded-lg text-sm font-medium";
    const btnClass = "bg-[#e3181f] text-white border-none p-4 font-black uppercase tracking-widest cursor-pointer w-full transition-all hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-lg shadow-lg active:scale-[0.98]";


    return (
        <div className="mt-[80px] min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 pb-20">

            {/* HEADER DASHBOARD */}
            <div className="text-center py-16 bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black px-4 mb-12 border-b border-gray-200 dark:border-white/5">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    Dashboard
                </h1>
                <p className="text-[#e3181f] font-black tracking-[5px] uppercase text-sm mt-2">
                    Control Panel // Admin Only
                </p>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row gap-12">

                {/* SIDEBAR NAVIGATION */}
                <aside className="md:w-64 flex-shrink-0">
                    <nav className="flex flex-col gap-3 sticky top-[100px]">
                        {[
                            { id: 'tournee', label: 'Tournée' },
                            { id: 'concerts', label: 'Concerts' },
                            { id: 'repetitions', label: 'Répétitions' },
                            { id: 'videos', label: 'Vidéos' },
                            { id: 'groupe', label: 'Le Groupe' },
                            { id: 'membres', label: 'Musiciens' },
                            { id: 'messages', label: "Livre d'Or" },
                        ].map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-[11px] tracking-widest border
                                    ${isActive
                                            ? 'bg-[#e3181f] !text-white border-[#e3181f] shadow-lg shadow-red-500/20'
                                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                                        }
                                `}
                                    // Style inline pour être certain de prendre le dessus si Tailwind est ignoré
                                    style={{ color: isActive ? 'white' : undefined }}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* CONTENU PRINCIPAL */}
                <main className="flex-1 space-y-24">

                    {/* RÉGLAGES GÉNÉRAUX */}
                    {activeSection === 'tournee' && (
                        <section id="tournee" className="animate-fadeIn">
                            <SectionTitle subtitle="Global Settings">Tournée en cours</SectionTitle>

                            <div className="bg-gray-100 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/5 p-8 rounded-2xl shadow-inner dark:shadow-2xl">
                                <form onSubmit={handleUpdateTitle} className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                                            Nom de la tournée
                                        </label>
                                        <input
                                            type="text"
                                            className={inputClass} // Utilise la constante globale réparée
                                            value={tourTitle}
                                            onChange={(e) => setTourTitle(e.target.value)}
                                            placeholder="ex: TOURNÉE 2026"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="submit"
                                            className={btnClass} // Utilise la constante globale pour avoir le ROUGE direct
                                        >
                                            Mettre à jour
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    )}

                    {/* SECTION CONCERTS */}
                    {activeSection === 'concerts' && (
                        <section id="concerts" className="animate-fadeIn">
                            <SectionTitle subtitle="Live Dates Management">Calendrier Concerts</SectionTitle>
                            <div className="grid lg:grid-cols-2 gap-12">

                                {/* Formulaire d'ajout */}
                                <div className="bg-gray-100 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/5 p-8 rounded-2xl shadow-inner">
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-400 dark:text-white/40">
                                        Ajouter une date
                                    </h3>
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

                                {/* Liste des concerts */}
                                <div className="space-y-4">
                                    {concerts.map(c => (
                                        <div key={c.id} className="p-5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-xl transition-colors shadow-sm">
                                            {editingConcert === c.id ? (
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
                                                            onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, heure: e.target.value } : con))}
                                                        />
                                                    </div>
                                                    <input
                                                        className={inputClass}
                                                        value={c.lieu}
                                                        onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, lieu: e.target.value } : con))}
                                                    />
                                                    <div className="flex gap-2 pt-2">
                                                        <button onClick={() => handleUpdateConcert(c)} className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-black p-3 rounded uppercase flex-1 transition-colors">Sauvegarder</button>
                                                        <button onClick={() => setEditingConcert(null)} className="bg-gray-200 dark:bg-white/10 text-black dark:text-white text-[10px] font-black p-3 rounded uppercase flex-1 transition-colors">Annuler</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="group flex justify-between items-center">
                                                    <div>
                                                        <span className="text-[#e3181f] font-black text-xs tracking-tighter uppercase block mb-1">
                                                            {new Date(c.date_concert).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-lg font-bold uppercase tracking-tight text-black dark:text-white">{c.titre}</span>
                                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest mt-1">{c.lieu}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button onClick={() => setEditingConcert(c.id)} className="text-gray-400 hover:text-black dark:hover:text-white transition-all text-[10px] font-black uppercase">Edit</button>
                                                        <button onClick={() => handleDelete(c.id)} className="text-gray-300 hover:text-[#e3181f] transition-all text-[10px] font-black uppercase">Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {/* Attention : S'assurer que le composant Pagination gère aussi le mode clair */}
                                    <Pagination pages={concertPages} onPageChange={fetchConcerts} />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION RÉPÉTITIONS */}
                    {activeSection === 'repetitions' && (
                        <section id="repetitions" className="animate-in fade-in duration-500">
                            <SectionTitle subtitle="Audio Archives">Studio & Backstage</SectionTitle>

                            <div className="grid lg:grid-cols-2 gap-12">

                                {/* Formulaire d'ajout */}
                                <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-xl dark:shadow-2xl h-fit sticky top-8">
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40 text-black dark:text-white">Nouveau morceau</h3>
                                    <form onSubmit={handleRepSubmit} className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="TITRE (ex: ATOMIC CITY)"
                                            className={`${inputClass} bg-gray-50 dark:bg-black border-black/10 dark:border-white/20`}
                                            value={repFormData.titre}
                                            onChange={(e) => setRepFormData({ ...repFormData, titre: e.target.value })}
                                            required
                                        />

                                        <textarea
                                            placeholder="NOTES TECHNIQUES (ex: Attention à la transition bridge/refrain)"
                                            className={`${inputClass} h-24 resize-none py-3 bg-gray-50 dark:bg-black border-black/10 dark:border-white/20`}
                                            value={repFormData.detail}
                                            onChange={(e) => setRepFormData({ ...repFormData, detail: e.target.value })}
                                        />

                                        {/* --- GESTION DES MARKERS --- */}
                                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/5 dark:border-white/10 space-y-3">
                                            <label className="block text-[10px] font-black uppercase text-primary/60 ml-1">Markers (Points d'intérêt)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Sec"
                                                    value={newMarker.time}
                                                    onChange={(e) => setNewMarker({ ...newMarker, time: e.target.value })}
                                                    className="w-20 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-2 rounded text-sm text-black dark:text-white focus:border-primary/50 outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Label (ex: Solo)"
                                                    value={newMarker.label}
                                                    onChange={(e) => setNewMarker({ ...newMarker, label: e.target.value })}
                                                    className="flex-1 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-2 rounded text-sm text-black dark:text-white focus:border-primary/50 outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addMarker}
                                                    className="bg-primary hover:bg-primary/80 px-4 rounded font-bold text-[10px] text-white transition-colors"
                                                >
                                                    AJOUTER
                                                </button>
                                            </div>

                                            {/* Liste des markers ajoutés */}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {markers.map((m, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-white dark:bg-black px-2 py-1 rounded border border-primary/30 text-[10px] animate-in zoom-in duration-200">
                                                        <span className="text-primary font-bold">{m.time}s</span>
                                                        <span className="text-gray-500 dark:text-gray-400">{m.label}</span>
                                                        <button type="button" onClick={() => removeMarker(i)} className="text-black/40 dark:text-white/40 hover:text-primary transition-colors">✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* --- TEMPS & STATUT --- */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Début (sec)</label>
                                                <input
                                                    type="number"
                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                    value={repFormData.start_time}
                                                    onChange={(e) => setRepFormData({ ...repFormData, start_time: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Fin (sec)</label>
                                                <input
                                                    type="number"
                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                    value={repFormData.end_time}
                                                    onChange={(e) => setRepFormData({ ...repFormData, end_time: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Visibilité</label>
                                                <select
                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                    value={repFormData.status}
                                                    onChange={(e) => setRepFormData({ ...repFormData, status: e.target.value })}
                                                >
                                                    <option value="private">Privé</option>
                                                    <option value="public">Public</option>
                                                </select>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="URL AUDIO DIRECTE (Optionnel)"
                                            className={`${inputClass} bg-gray-50 dark:bg-black`}
                                            value={repFormData.url}
                                            onChange={(e) => setRepFormData({ ...repFormData, url: e.target.value })}
                                        />

                                        <div className="text-center text-[10px] font-black uppercase opacity-20 py-2 text-black dark:text-white">— OU —</div>

                                        {/* Upload de fichier */}
                                        <div className="p-4 border-2 border-dashed border-black/10 dark:border-white/5 rounded-lg text-center hover:border-primary/30 transition-all bg-black/5 dark:bg-white/5">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                className="hidden"
                                                id="audio-upload"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setRepFile(file);
                                                        if (!repFormData.titre) {
                                                            const fileName = file.name.split('.').slice(0, -1).join('.');
                                                            setRepFormData(prev => ({ ...prev, titre: fileName.toUpperCase() }));
                                                        }
                                                    }
                                                }}
                                            />
                                            <label htmlFor="audio-upload" className="cursor-pointer text-[10px] font-black uppercase tracking-[2px] text-gray-500 dark:text-[#666] hover:text-primary dark:hover:text-white block">
                                                {repFile ? <span className="text-primary animate-pulse">🎵 {repFile.name}</span> : "Cliquez pour uploader un MP3"}
                                            </label>
                                        </div>

                                        <button type="submit" className={btnClass}>Envoyer au studio</button>
                                    </form>
                                </div>

                                {/* Liste des enregistrements */}
                                <div className="space-y-4">
                                    {repetitions.length > 0 ? (
                                        repetitions.map(r => (
                                            <div key={r.id} className="p-5 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-xl hover:border-black/10 dark:hover:border-white/10 shadow-sm dark:shadow-none transition-all group">

                                                {editingRep === r.id ? (
                                                    /* --- MODE ÉDITION --- */
                                                    <div className="space-y-4">
                                                        <input
                                                            className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                            value={r.titre}
                                                            onChange={(e) => setRepetitions(repetitions.map(item => item.id === r.id ? { ...item, titre: e.target.value } : item))}
                                                        />

                                                        <div className="bg-black/5 dark:bg-white/5 p-3 rounded border border-black/10 dark:border-white/10">
                                                            <label className="block text-[9px] font-black uppercase text-primary/60 mb-2">Modifier les Markers</label>
                                                            <div className="flex gap-2 mb-2">
                                                                <input
                                                                    type="number"
                                                                    placeholder="Sec"
                                                                    value={newMarker.time}
                                                                    onChange={(e) => setNewMarker({ ...newMarker, time: e.target.value })}
                                                                    className="w-16 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-1 text-xs text-black dark:text-white"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Label"
                                                                    value={newMarker.label}
                                                                    onChange={(e) => setNewMarker({ ...newMarker, label: e.target.value })}
                                                                    className="flex-1 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-1 text-xs text-black dark:text-white"
                                                                />
                                                                <button type="button" onClick={addMarker} className="bg-primary px-2 rounded text-[9px] font-bold text-white">OK</button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {markers.map((m, i) => (
                                                                    <div key={i} className="flex items-center gap-1 bg-white dark:bg-black px-2 py-0.5 rounded text-[9px] border border-black/10 dark:border-white/10">
                                                                        <span className="text-primary font-bold">{m.time}s</span>
                                                                        <span className="text-black dark:text-white">{m.label}</span>
                                                                        <button type="button" onClick={() => removeMarker(i)} className="hover:text-red-500 ml-1">✕</button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Début (sec)</label>
                                                                <input
                                                                    type="number"
                                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                                    value={r.start_time || 0}
                                                                    onChange={(e) => setRepetitions(repetitions.map(item =>
                                                                        item.id === r.id ? { ...item, start_time: parseFloat(e.target.value) } : item
                                                                    ))}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Fin (sec)</label>
                                                                <input
                                                                    type="number"
                                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                                    value={r.end_time || 0}
                                                                    onChange={(e) => setRepetitions(repetitions.map(item =>
                                                                        item.id === r.id ? { ...item, end_time: parseFloat(e.target.value) } : item
                                                                    ))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRepUpdate(r, updateFile)}
                                                                className="flex-1 bg-primary text-white text-[10px] font-black py-2 rounded hover:bg-primary/80 transition-colors"
                                                            >
                                                                SAUVEGARDER
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingRep(null);
                                                                    setMarkers([]);
                                                                    setUpdateFile(null);
                                                                }}
                                                                className="flex-1 bg-black/10 dark:bg-white/10 text-black dark:text-white text-[10px] font-black py-2 rounded hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                                                            >
                                                                ANNULER
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* --- MODE AFFICHAGE --- */
                                                    <>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-black dark:text-white font-bold block uppercase tracking-tight text-base leading-none">{r.titre}</span>
                                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${r.status === 'public' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'}`}>
                                                                        {r.status === 'public' ? 'Public' : 'Privé'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-primary font-bold uppercase tracking-widest leading-tight">{r.detail}</p>

                                                                {r.markers && (
                                                                    <div className="mt-3 flex flex-wrap gap-1">
                                                                        {(typeof r.markers === 'string' ? JSON.parse(r.markers) : r.markers).map((m, idx) => (
                                                                            <button
                                                                                key={idx}
                                                                                onClick={() => jumpToTime(r.id, m.time)}
                                                                                className="text-[8px] border border-primary/30 bg-primary/5 hover:bg-primary/20 px-2 py-0.5 rounded text-black/70 dark:text-white/80 transition-all active:scale-95 flex items-center gap-1"
                                                                            >
                                                                                <strong className="text-primary">{m.time}s</strong> {m.label} ⚡
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                                                <button onClick={() => {
                                                                    setEditingRep(r.id);
                                                                    setMarkers(typeof r.markers === 'string' ? JSON.parse(r.markers || '[]') : (r.markers || []));
                                                                }} className="text-black/30 dark:text-white/30 hover:text-primary dark:hover:text-white text-[10px] font-black uppercase">Edit</button>
                                                                <button onClick={() => handleRepDelete(r.id)} className="text-gray-400 dark:text-[#444] hover:text-red-500 dark:hover:text-primary text-[10px] font-black uppercase">Delete</button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <WavePlayer
                                                                id={`wave-${r.id}`}
                                                                url={r.url.startsWith('/uploads') ? `http://localhost:5000${r.url}` : r.url}
                                                                startTime={r.start_time}
                                                                endTime={r.end_time}
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/5 rounded-2xl opacity-40 dark:opacity-20">
                                            <p className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Aucun enregistrement disponible</p>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {repPages > 1 && (
                                        <Pagination pages={repPages} onPageChange={fetchRepetitions} />
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION VIDÉOS */}
                    {activeSection === 'videos' && (
                        <section id="videos" className="animate-in fade-in duration-500">
                            <SectionTitle subtitle="Visual Content">Vidéos</SectionTitle>
                            <div className="grid lg:grid-cols-2 gap-12">

                                {/* Formulaire d'ajout */}
                                <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-xl">
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40 text-black dark:text-white">Nouvelle Vidéo</h3>
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
                                            placeholder="DESCRIPTION / LIEU (ex: LIVE À SIX-FOURS)"
                                            className={inputClass}
                                            value={videoFormData.description}
                                            onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                                        />

                                        {/* Option 1: URL Youtube */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1 text-black dark:text-white">Lien YouTube</label>
                                            <input
                                                type="text"
                                                placeholder="ID YOUTUBE (ex: UrrtAPj9Nzw)"
                                                className={inputClass}
                                                value={videoFormData.url_youtube}
                                                onChange={(e) => setVideoFormData({ ...videoFormData, url_youtube: e.target.value })}
                                            />
                                        </div>

                                        <div className="text-center text-[10px] font-black uppercase opacity-20 py-2 text-black dark:text-white">— OU —</div>

                                        {/* Option 2: Upload Fichier Vidéo */}
                                        <div className="p-4 border-2 border-dashed border-black/5 dark:border-white/5 rounded-lg text-center hover:border-primary/30 transition-all bg-black/[0.02] dark:bg-white/5">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                id="video-upload"
                                                onChange={(e) => setVideoFile(e.target.files[0])}
                                            />
                                            <label htmlFor="video-upload" className="cursor-pointer text-[10px] font-black uppercase tracking-[2px] text-black/40 dark:text-[#666] hover:text-primary dark:hover:text-white block transition-colors">
                                                {videoFile ? (
                                                    <span className="text-primary font-bold">🎬 {videoFile.name}</span>
                                                ) : (
                                                    "Uploader un fichier vidéo (MP4...)"
                                                )}
                                            </label>
                                        </div>

                                        <button type="submit" className={btnClass}>Publier la vidéo</button>
                                    </form>
                                </div>

                                {/* Liste des vidéos */}
                                <div className="space-y-4">
                                    {videos.length > 0 ? (
                                        videos.map(v => (
                                            <div key={v.id} className="p-5 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-xl hover:border-primary/20 dark:hover:border-white/10 transition-all group shadow-sm">
                                                {editingVideo === v.id ? (
                                                    <div className="flex-1 flex flex-col gap-3">
                                                        <input
                                                            className={inputClass}
                                                            value={v.titre}
                                                            onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, titre: e.target.value } : item))}
                                                            placeholder="Titre"
                                                        />
                                                        <input
                                                            className={inputClass}
                                                            value={v.description || ''}
                                                            onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, description: e.target.value } : item))}
                                                            placeholder="Lieu"
                                                        />
                                                        <input
                                                            className={inputClass}
                                                            value={v.url_youtube || ''}
                                                            onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, url_youtube: e.target.value } : item))}
                                                            placeholder="ID Youtube"
                                                        />
                                                        <div className="flex gap-2 justify-end pt-2">
                                                            <button onClick={() => handleUpdateVideo(v)} className="bg-green-600 text-white px-4 py-2 rounded font-black text-[10px] uppercase">Sauvegarder</button>
                                                            <button onClick={() => setEditingVideo(null)} className="bg-black/5 dark:bg-white/10 text-black dark:text-white px-4 py-2 rounded font-black text-[10px] uppercase">Annuler</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="text-black dark:text-white font-bold block uppercase tracking-tight text-base">{v.titre}</span>
                                                            <span className="text-[11px] text-primary font-bold uppercase tracking-widest">
                                                                {v.description} — {v.url_youtube ? "YOUTUBE" : "FICHIER LOCAL"}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setEditingVideo(v.id)} className="text-black/30 dark:text-white/30 hover:text-primary dark:hover:text-white text-[10px] font-black uppercase tracking-widest">Edit</button>
                                                            <button onClick={() => handleVideoDelete(v.id)} className="text-black/20 dark:text-[#444] hover:text-red-500 text-[10px] font-black uppercase tracking-widest">Delete</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/5 rounded-2xl opacity-40">
                                            <p className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Aucune vidéo en ligne</p>
                                        </div>
                                    )}
                                    <Pagination pages={videoPages} onPageChange={fetchVideos} />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION LE GROUPE */}
                    {activeSection === 'groupe' && (
                        <section id="groupe" className="animate-in fade-in duration-500">
                            <SectionTitle subtitle="Band Identity">Le Groupe</SectionTitle>

                            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl space-y-8 shadow-xl dark:shadow-2xl transition-colors">

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

                                {/* Titre de la section Histoire */}
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
                                            className={`${inputClass} min-h-[180px] leading-relaxed py-4`}
                                            value={groupTexts.group_history_1 || ''}
                                            onChange={(e) => setGroupTexts({ ...groupTexts, group_history_1: e.target.value })}
                                            onBlur={() => handleUpdateGroupText('group_history_1', groupTexts.group_history_1)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Histoire (Colonne Droite)</label>
                                        <textarea
                                            className={`${inputClass} min-h-[180px] leading-relaxed py-4`}
                                            value={groupTexts.group_history_2 || ''}
                                            onChange={(e) => setGroupTexts({ ...groupTexts, group_history_2: e.target.value })}
                                            onBlur={() => handleUpdateGroupText('group_history_2', groupTexts.group_history_2)}
                                        />
                                    </div>
                                </div>

                                {/* Ligne : Crédits Photos */}
                                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                                    <div className="max-w-md space-y-2">
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
                                        <p className="text-[9px] text-black/30 dark:text-white/20 uppercase tracking-[2px] mt-2">
                                            Visible globalement en pied de page.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION MUSICIENS */}
                    {activeSection === 'membres' && (
                        <section id="membres" className="animate-in fade-in duration-500">
                            <SectionTitle subtitle="Band Members">Gestion des Musiciens</SectionTitle>

                            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-xl dark:shadow-2xl transition-colors">

                                {/* Formulaire d'ajout amélioré */}
                                <div className="mb-10 p-6 bg-black/[0.02] dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                                    <h3 className="text-[10px] font-black uppercase tracking-[3px] mb-4 opacity-40 dark:opacity-30 text-center text-black dark:text-white">
                                        Ajouter un membre
                                    </h3>
                                    <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nom du musicien"
                                            className={inputClass}
                                            value={newMember.nom}
                                            onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Instrument (ex: Guitar)"
                                            className={inputClass}
                                            value={newMember.instrument}
                                            onChange={(e) => setNewMember({ ...newMember, instrument: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="URL de la photo"
                                            className={inputClass}
                                            value={newMember.photo_url}
                                            onChange={(e) => setNewMember({ ...newMember, photo_url: e.target.value })}
                                        />
                                        <button type="submit" className={btnClass}>Ajouter au groupe</button>
                                    </form>
                                </div>

                                {/* Liste des membres avec Edition complète */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {groupMembers.length > 0 ? (
                                        groupMembers.map(m => (
                                            <div key={m.id} className="relative p-5 bg-black/[0.02] dark:bg-black border border-black/5 dark:border-white/10 rounded-xl hover:border-primary/30 transition-all group min-h-[100px] flex items-center">
                                                {editingMember === m.id ? (
                                                    <div className="w-full space-y-3">
                                                        <input
                                                            className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-2 text-xs rounded text-black dark:text-white font-bold"
                                                            value={m.nom}
                                                            onChange={(e) => setGroupMembers(groupMembers.map(item => item.id === m.id ? { ...item, nom: e.target.value } : item))}
                                                        />
                                                        <input
                                                            className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-2 text-xs rounded text-primary font-bold"
                                                            value={m.instrument}
                                                            onChange={(e) => setGroupMembers(groupMembers.map(item => item.id === m.id ? { ...item, instrument: e.target.value } : item))}
                                                        />
                                                        <div className="flex gap-2 pt-1">
                                                            <button onClick={() => handleUpdateMember(m)} className="bg-primary/20 text-primary px-3 py-1 rounded text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-colors flex-1">Save</button>
                                                            <button onClick={() => setEditingMember(null)} className="text-black/40 dark:text-white/30 text-[10px] font-black uppercase underline flex-1 hover:text-black dark:hover:text-white">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="absolute top-2 right-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setEditingMember(m.id)} className="text-black/40 dark:text-white/30 hover:text-primary dark:hover:text-white text-[9px] font-black uppercase">Edit</button>
                                                            <button onClick={() => handleDeleteMember(m.id)} className="text-black/20 dark:text-[#333] hover:text-red-500 text-[9px] font-black uppercase">Delete</button>
                                                        </div>

                                                        {/* Avatar et Infos */}
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                {m.photo_url ? (
                                                                    <img src={m.photo_url} alt={m.nom} className="w-12 h-12 rounded-full object-cover border-2 border-black/5 dark:border-white/5" />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 flex items-center justify-center text-[10px] font-black opacity-20 text-black dark:text-white">N/A</div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-black dark:text-white font-bold uppercase tracking-tight leading-none mb-1">{m.nom}</p>
                                                                <p className="text-primary text-[10px] font-black uppercase tracking-[2px]">{m.instrument}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center opacity-30 dark:opacity-20 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Aucun membre enregistré</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION LIVRE D'OR */}
                    {activeSection === 'messages' && (
                        <section id="messages" className="animate-in fade-in duration-500">
                            <SectionTitle subtitle="Fan Messages">Livre d'Or</SectionTitle>

                            <div className="space-y-6">
                                {Array.isArray(messages) && messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`bg-white dark:bg-[#0a0a0a] border ${msg.is_private
                                                    ? 'border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]'
                                                    : 'border-black/5 dark:border-white/5'
                                                } p-6 rounded-2xl transition-all group shadow-sm dark:shadow-2xl`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-primary text-[10px] font-black uppercase tracking-[2px]">
                                                            Par {msg.firstname || `Utilisateur #${msg.user_id}`}
                                                            <span className="mx-2 opacity-20">—</span>
                                                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                                                        </span>

                                                        {msg.is_private === 1 && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-primary text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                                                                    Message Privé
                                                                </span>
                                                                <span
                                                                    className="text-black/60 dark:text-white/60 text-[10px] font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/5 dark:border-white/10 select-all cursor-help"
                                                                    title="Cliquez pour copier l'email"
                                                                >
                                                                    {msg.email || 'Email non trouvé'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-black dark:text-white text-base italic leading-relaxed">"{msg.content}"</p>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className="text-black/20 dark:text-[#333] hover:text-red-500 transition-colors text-[10px] font-black uppercase md:opacity-0 group-hover:opacity-100"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>

                                            {/* Zone de Réponse / Note */}
                                            <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] -mx-6 px-6 -mb-6 rounded-b-2xl">
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[9px] font-black uppercase tracking-[2px] text-black/40 dark:text-white/30">
                                                        {msg.is_private ? 'Note interne (Suivi de réponse)' : 'Réponse publique (Sera visible sur le site)'}
                                                    </label>

                                                    <textarea
                                                        className={`${inputClass} min-h-[100px] text-sm bg-white dark:bg-black/40 border-black/10 dark:border-white/5 focus:border-primary/40`}
                                                        placeholder={msg.is_private ? `L'adresse est ${msg.email}. Notez ici vos échanges...` : "Écrivez votre réponse publique..."}
                                                        value={msg.reponse || ''}
                                                        onChange={(e) => {
                                                            const nouveauTexte = e.target.value;
                                                            setMessages(messages.map(m => m.id === msg.id ? { ...m, reponse: nouveauTexte } : m));
                                                        }}
                                                    />

                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-[9px] text-black/30 dark:text-white/20 uppercase font-bold tracking-widest">
                                                            {msg.is_private ? "Les messages privés ne sont jamais publiés" : "Attention : La réponse sera publiée sur le site"}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdateResponse(msg.id, msg.reponse)}
                                                            className="bg-primary text-black dark:bg-primary/10 dark:text-primary dark:hover:bg-primary dark:hover:text-black px-6 py-2 rounded font-black text-[10px] uppercase transition-all border border-primary/20"
                                                        >
                                                            Enregistrer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/5 rounded-3xl opacity-40 dark:opacity-20">
                                        <p className="text-xs font-black uppercase tracking-[3px] text-black dark:text-white">Le livre d'or est vide</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );

}

export default Dashboard;