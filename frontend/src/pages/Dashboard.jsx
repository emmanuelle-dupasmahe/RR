import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import TourneeSection from './dashboard/TourneeSection';
import ConcertsSection from './dashboard/ConcertsSection';
import DesignSection from './dashboard/DesignSection';
import UsersSection from './dashboard/UsersSection';
import RepetitionsSection from './dashboard/RepetitionsSection';
import VideosSection from './dashboard/VideosSection';
import GroupeSection from './dashboard/GroupeSection';
import MembresSection from './dashboard/MembresSection';
import MessagesSection from './dashboard/MessagesSection';
import {
    concertService,
    repetitionService,
    videoService,
    memberService,
    settingsService,
    guestbookService,
    userService,
    BASE_URL
} from '../services/api';

function Dashboard() {
    const { user, token } = useAuth();
    const [concerts, setConcerts] = useState([]);
    const [concertPages, setConcertPages] = useState({ current: 1, total: 1 });
    const [formData, setFormData] = useState({ titre: '', date_concert: '', heure: '', lieu: '', adresse: '', telephone: '', statut: 'Entrée libre' });
    const [concertFlyerFile, setConcertFlyerFile] = useState(null);
    const [updateConcertFlyerFile, setUpdateConcertFlyerFile] = useState(null);
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
    const [newMemberPhotoFile, setNewMemberPhotoFile] = useState(null);
    const [updateMemberPhotoFile, setUpdateMemberPhotoFile] = useState(null);
    const [groupTexts, setGroupTexts] = useState({
        group_slogan: '',
        group_announce: '',
        group_history_1: '',
        group_history_2: '',
        group_title_history: '',
        photo_credits: ''
    });
    const [newMember, setNewMember] = useState({ nom: '', instrument: '', ordre_affichage: 0 });

    const [messages, setMessages] = useState([]);
    const [reponses, setReponses] = useState({}); // Objet pour stocker { messageId: "le texte" }

    const handleChangementReponse = (id, texte) => {
        setReponses(prev => ({ ...prev, [id]: texte }));
    };

    const [activeSection, setActiveSection] = useState('tournee');

    const [markers, setMarkers] = useState([]);
    const [newMarker, setNewMarker] = useState({ time: '', label: '' });

    const [updateFile, setUpdateFile] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    // --- LOGIQUE FETCH ---

    const fetchRepetitions = async (page = 1) => {
        try {
            const data = await repetitionService.getAll(page, 5);
            setRepetitions(data.repetitions || []);
            setRepPages({ current: data.currentPage, total: data.totalPages });
        } catch (err) {
            console.error("Erreur lors du chargement des répétitions :", err);
        }
    };

    const fetchConcerts = async (page = 1) => {
        try {
            const data = await concertService.getAll(page, 5);
            setConcerts(data.concerts || []);
            setConcertPages({ current: data.currentPage, total: data.totalPages });
        } catch (err) { console.error(err); }
    };

    const fetchVideos = async (page = 1) => {
        try {
            const data = await videoService.getAll(page, 5);
            setVideos(data.videos || []);
            setVideoPages({ current: data.currentPage, total: data.totalPages });
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchConcerts();
        fetchRepetitions();
        fetchVideos();
        settingsService.getTourTitle()
            .then(data => setTourTitle(data.value || ''));

        memberService.getAll().then(setGroupMembers);
        settingsService.getGroupSettings().then(setGroupTexts);
        guestbookService.getAdminAll()
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
        try {
            const data = new FormData();
            data.append('titre', formData.titre);
            data.append('date_concert', formData.date_concert);
            data.append('heure', formData.heure);
            data.append('lieu', formData.lieu);
            data.append('adresse', formData.adresse || '');
            data.append('telephone', formData.telephone || '');
            data.append('statut', formData.statut || 'Entrée libre');
            if (concertFlyerFile) {
                data.append('flyer', concertFlyerFile);
            }

            await concertService.create(data);
            setFormData({ titre: '', date_concert: '', heure: '', lieu: '', adresse: '', telephone: '', statut: 'Entrée libre' });
            setConcertFlyerFile(null);
            fetchConcerts();
            alert('Concert publié !');
        } catch (errorData) {
            alert(`Erreur: ${errorData.error || "Échec de la publication"}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette date ?")) return;
        try {
            await concertService.delete(id);
            fetchConcerts();
            alert('Date supprimée');
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleUpdateConcert = async (concert, selectedFile = null) => {
        // Préparation des données pour MySQL (nettoyage des formats)
        const payload = new FormData();
        payload.append('titre', concert.titre);
        payload.append('date_concert', concert.date_concert.includes('T') ? concert.date_concert.split('T')[0] : concert.date_concert);
        payload.append('heure', concert.heure ? concert.heure.substring(0, 5) : '');
        payload.append('lieu', concert.lieu);
        payload.append('adresse', concert.adresse || '');
        payload.append('telephone', concert.telephone || '');
        payload.append('statut', concert.statut || 'Entrée libre');
        payload.append('flyer_url', concert.flyer_url || '');
        if (selectedFile) {
            payload.append('flyer', selectedFile);
        }

        try {
            await concertService.update(concert.id, payload);
            setEditingConcert(null);
            setUpdateConcertFlyerFile(null);
            fetchConcerts();
            alert('Concert mis à jour avec succès !');
        } catch (err) {
            console.error("Erreur update concert", err);
            alert(`Erreur: ${err.message || 'Impossible de mettre à jour'}`);
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

            await repetitionService.update(rep.id, formData);
            setEditingRep(null);
            setUpdateFile(null);
            setMarkers([]);
            fetchRepetitions();
            alert('Morceau mis à jour');
        } catch (err) {
            alert(`Erreur: ${err.message || 'Impossible de mettre à jour'}`);
        }
    };


    //modification vidéos
    const handleUpdateVideo = async (video) => {
        try {
            await videoService.update(video.id, {
                titre: video.titre,
                description: video.description,
                url_youtube: video.url_youtube
            });
            setEditingVideo(null);
            fetchVideos();
            alert('Vidéo mise à jour');
        } catch (err) {
            alert(`Erreur: ${err.message || 'Impossible de mettre à jour'}`);
        }
    };

    //modification membres
    const handleUpdateMember = async (member, selectedFile = null) => {
        try {
            const data = new FormData();
            data.append('nom', member.nom);
            data.append('instrument', member.instrument);
            data.append('ordre_affichage', member.ordre_affichage || 0);
            data.append('photo_url', member.photo_url || '');
            if (selectedFile) {
                data.append('photo', selectedFile);
            }

            await memberService.update(member.id, data);
            setEditingMember(null);
            setUpdateMemberPhotoFile(null);
            memberService.getAll().then(setGroupMembers);
            alert('Musicien mis à jour');
        } catch (err) {
            alert(`Erreur: ${err.message || 'Impossible de mettre à jour'}`);
        }
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

        try {
            await repetitionService.create(data);
            setRepFormData({ titre: '', detail: '', url: '' });
            setRepFile(null);
            setMarkers([]);
            e.target.reset();
            fetchRepetitions();
            alert('Morceau ajouté au studio !');
        } catch (err) {
            alert(`Erreur: ${err.message || "Échec de l'ajout"}`);
        }
    };

    // Mettre à jour un texte (Slogan, etc.)
    const handleUpdateGroupText = async (key, value) => {
        try {
            await settingsService.updateGroupSetting(key, value);
        } catch (err) {
            console.error("Erreur de mise à jour du texte");
        }
    };

    // Ajouter un nouveau membre
    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('nom', newMember.nom);
            data.append('instrument', newMember.instrument);
            data.append('ordre_affichage', newMember.ordre_affichage || 0);
            if (newMemberPhotoFile) {
                data.append('photo', newMemberPhotoFile);
            }

            await memberService.create(data);
            memberService.getAll().then(setGroupMembers);
            setNewMember({ nom: '', instrument: '', ordre_affichage: 0 });
            setNewMemberPhotoFile(null);
            alert('Musicien ajouté !');
        } catch (err) {
            alert(`Erreur: ${err.message || "Échec de l'ajout"}`);
        }
    };

    // Supprimer un nouveau membre
    const handleDeleteMember = async (id) => {
        if (!window.confirm("Supprimer ce membre du groupe ?")) return;

        try {
            await memberService.delete(id);
            setGroupMembers(groupMembers.filter(m => m.id !== id));
            alert('Membre supprimé');
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    // Sauvegarder la réponse 
    const handleUpdateResponse = async (id, texte) => {
        try {
            await guestbookService.updateResponse(id, texte);
            alert("Réponse enregistrée avec succès !");
        } catch (err) {
            alert(`Erreur: ${err.message || "Erreur lors de la sauvegarde"}`);
        }
    };

    // Supprimer un message
    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Supprimer ce message ?")) return;
        try {
            await guestbookService.deleteMessage(id);
            setMessages(messages.filter(m => m.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    //suppression repetes
    const handleRepDelete = async (id) => {
        if (!window.confirm("Supprimer ce morceau ?")) return;
        try {
            await repetitionService.delete(id);
            fetchRepetitions();
            alert('Morceau supprimé');
        } catch (err) {
            alert(`Erreur lors de la suppression : ${err.message || 'Erreur inconnue'}`);
        }
    };

    //modification tournée
    const handleUpdateTitle = async (e) => {
        e.preventDefault();
        try {
            await settingsService.updateTourTitle(tourTitle);
            alert('Titre de la tournée mis à jour !');
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('titre', videoFormData.titre);
        data.append('description', videoFormData.description);
        data.append('url_youtube', videoFormData.url_youtube);
        if (videoFile) data.append('video', videoFile);

        try {
            await videoService.create(data);
            setVideoFormData({ titre: '', description: '', url_youtube: '' });
            setVideoFile(null);
            e.target.reset();
            fetchVideos();
            alert('Vidéo publiée !');
        } catch (err) {
            alert(`Erreur: ${err.message || "Échec de la publication"}`);
        }
    };

    const handleVideoDelete = async (id) => {
        if (!window.confirm("Supprimer cette vidéo ?")) return;
        try {
            await videoService.delete(id);
            fetchVideos();
            alert('Vidéo supprimée');
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    //pour gérer les utilisateurs
    const fetchUsers = async () => {
        try {
            const data = await userService.getAll();
            setAllUsers(data);
        } catch (error) {
            console.error("Erreur:", error.message);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'user' ? 'member' : 'user';
        try {
            await userService.updateRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        try {
            await userService.delete(userId);
            fetchUsers();
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (activeSection === 'users') {
            fetchUsers();
        }
    }, [activeSection]);


    //pour changer l'image page Home
    const handleHeroUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            await settingsService.updateHeroImage(key, formData);
            alert("Image mise à jour !");
        } catch (err) {
            alert("Erreur lors de l'envoi");
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
        <div className="mt-[80px] min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 pb-20 overflow-x-hidden w-full max-w-full">

            {/* HEADER DASHBOARD */}
            <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black px-4 mb-12 border-b border-gray-200 dark:border-white/5">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    Dashboard
                </h1>
                <p className="text-[#e3181f] font-black tracking-[5px] uppercase text-sm mt-2">
                    Control Panel // Admin Only
                </p>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8 md:gap-12">

                {/* SIDEBAR NAVIGATION */}
                <aside className="md:w-64 flex-shrink-0">
                    <nav className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 sticky top-[100px]">
                        {[
                            { id: 'tournee', label: 'Tournée' },
                            { id: 'concerts', label: 'Concerts' },
                            { id: 'repetitions', label: 'Répétitions' },
                            { id: 'videos', label: 'Vidéos' },
                            { id: 'groupe', label: 'Le Groupe' },
                            { id: 'design', label: 'Hero' },
                            { id: 'membres', label: 'Musiciens' },
                            { id: 'messages', label: "Livre d'Or" },
                            { id: 'users', label: "Utilisateurs" },
                        ].map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`
                                    flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all font-bold uppercase text-[9px] md:text-[11px] tracking-widest border
                                    ${isActive
                                            ? 'bg-[#e3181f] !text-white border-[#e3181f] shadow-lg shadow-red-500/20'
                                            : 'bg-transparent text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                                        }
                                `}

                                    style={{ color: isActive ? 'white' : undefined }}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* CONTENU PRINCIPAL */}
                <main className="flex-1 space-y-12 md:space-y-24 w-full overflow-hidden">

                    {/* RÉGLAGES GÉNÉRAUX */}
                    {activeSection === 'tournee' && (
                        <TourneeSection
                            SectionTitle={SectionTitle}
                            tourTitle={tourTitle}
                            setTourTitle={setTourTitle}
                            handleUpdateTitle={handleUpdateTitle}
                            inputClass={inputClass}
                            btnClass={btnClass}
                        />
                    )}

                    {/* SECTION CONCERTS */}
                    {activeSection === 'concerts' && (
                        <ConcertsSection
                            SectionTitle={SectionTitle}
                            Pagination={Pagination}
                            concerts={concerts}
                            concertPages={concertPages}
                            formData={formData}
                            setFormData={setFormData}
                            concertFlyerFile={concertFlyerFile}
                            setConcertFlyerFile={setConcertFlyerFile}
                            editingConcert={editingConcert}
                            setEditingConcert={setEditingConcert}
                            updateConcertFlyerFile={updateConcertFlyerFile}
                            setUpdateConcertFlyerFile={setUpdateConcertFlyerFile}
                            setConcerts={setConcerts}
                            handleSubmit={handleSubmit}
                            handleUpdateConcert={handleUpdateConcert}
                            handleDelete={handleDelete}
                            fetchConcerts={fetchConcerts}
                            inputClass={inputClass}
                            btnClass={btnClass}
                        />
                    )}

                    {/* SECTION RÉPÉTITIONS */}
                    {activeSection === 'repetitions' && (
                        <RepetitionsSection
                            SectionTitle={SectionTitle}
                            Pagination={Pagination}
                            repetitions={repetitions}
                            repPages={repPages}
                            repFormData={repFormData}
                            setRepFormData={setRepFormData}
                            repFile={repFile}
                            setRepFile={setRepFile}
                            editingRep={editingRep}
                            setEditingRep={setEditingRep}
                            setRepetitions={setRepetitions}
                            markers={markers}
                            newMarker={newMarker}
                            setNewMarker={setNewMarker}
                            setMarkers={setMarkers}
                            updateFile={updateFile}
                            setUpdateFile={setUpdateFile}
                            addMarker={addMarker}
                            removeMarker={removeMarker}
                            jumpToTime={jumpToTime}
                            handleRepSubmit={handleRepSubmit}
                            handleRepUpdate={handleRepUpdate}
                            handleRepDelete={handleRepDelete}
                            fetchRepetitions={fetchRepetitions}
                            inputClass={inputClass}
                            btnClass={btnClass}
                            BASE_URL={BASE_URL}
                        />
                    )}

                    {/* SECTION VIDÉOS */}
                    {activeSection === 'videos' && (
                        <VideosSection
                            SectionTitle={SectionTitle}
                            Pagination={Pagination}
                            videos={videos}
                            videoPages={videoPages}
                            videoFormData={videoFormData}
                            setVideoFormData={setVideoFormData}
                            videoFile={videoFile}
                            setVideoFile={setVideoFile}
                            editingVideo={editingVideo}
                            setEditingVideo={setEditingVideo}
                            setVideos={setVideos}
                            handleVideoSubmit={handleVideoSubmit}
                            handleUpdateVideo={handleUpdateVideo}
                            handleVideoDelete={handleVideoDelete}
                            fetchVideos={fetchVideos}
                            inputClass={inputClass}
                            btnClass={btnClass}
                        />
                    )}

                    {/* SECTION LE GROUPE */}
                    {activeSection === 'groupe' && (
                        <GroupeSection
                            SectionTitle={SectionTitle}
                            groupTexts={groupTexts}
                            setGroupTexts={setGroupTexts}
                            handleUpdateGroupText={handleUpdateGroupText}
                            inputClass={inputClass}
                        />
                    )}


                    {/* --- SECTION : DESIGN / HERO --- */}
                    {activeSection === 'design' && (
                        <DesignSection
                            SectionTitle={SectionTitle}
                            handleHeroUpload={handleHeroUpload}
                            inputClass={inputClass}
                        />
                    )}

                    {/* SECTION MUSICIENS */}
                    {activeSection === 'membres' && (
                        <MembresSection
                            SectionTitle={SectionTitle}
                            groupMembers={groupMembers}
                            editingMember={editingMember}
                            setEditingMember={setEditingMember}
                            setGroupMembers={setGroupMembers}
                            newMember={newMember}
                            setNewMember={setNewMember}
                            newMemberPhotoFile={newMemberPhotoFile}
                            setNewMemberPhotoFile={setNewMemberPhotoFile}
                            updateMemberPhotoFile={updateMemberPhotoFile}
                            setUpdateMemberPhotoFile={setUpdateMemberPhotoFile}
                            handleAddMember={handleAddMember}
                            handleUpdateMember={handleUpdateMember}
                            handleDeleteMember={handleDeleteMember}
                            inputClass={inputClass}
                            btnClass={btnClass}
                            BASE_URL={BASE_URL}
                        />
                    )}

                    {/* SECTION LIVRE D'OR */}
                    {activeSection === 'messages' && (
                        <MessagesSection
                            SectionTitle={SectionTitle}
                            messages={messages}
                            setMessages={setMessages}
                            handleDeleteMessage={handleDeleteMessage}
                            handleUpdateResponse={handleUpdateResponse}
                            inputClass={inputClass}
                        />
                    )}

                    {/* SECTION GESTION DES UTILISATEURS */}
                    {activeSection === 'users' && (
                        <UsersSection
                            SectionTitle={SectionTitle}
                            allUsers={allUsers}
                            handleToggleRole={handleToggleRole}
                            handleDeleteUser={handleDeleteUser}
                        />
                    )}

                </main>
            </div>
        </div>
    );

}

export default Dashboard;
