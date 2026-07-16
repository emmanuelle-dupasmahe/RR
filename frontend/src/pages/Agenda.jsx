import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Helmet } from 'react-helmet-async';

// ── CONFIGURATION DU CALENDRIER ──
const locales = { 'fr': fr };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

// ── FONCTION UTILITAIRE SÉCURISÉE POUR LES DATES ──
const formatForInput = (dateObj) => {
    if (!dateObj) return '';
    try {
        const d = new Date(dateObj);
        if (isNaN(d.getTime())) return '';
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    } catch (error) {
        return '';
    }
};

function Agenda() {
    const { user, isAuthenticated } = useAuth();

    // Initialisation avec un tableau vide
    const [events, setEvents] = useState([]);

    // ── ÉTATS POUR LA NAVIGATION DU CALENDRIER ──
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');

    // ── ÉTATS POUR LA MODALE ──
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        location: '',
        type: 'indispo'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin';

    // ── CHARGEMENT DES DONNÉES DEPUIS LE BACKEND ──
    useEffect(() => {
        const fetchEvents = async () => {
            if (!isAuthenticated) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/calendar`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();

                    const formattedEvents = data.map(evt => {
                        let type = 'indispo';
                        const lowerDesc = evt.description ? evt.description.toLowerCase() : '';
                        const lowerTitle = evt.summary ? evt.summary.toLowerCase() : '';

                        if (lowerDesc.includes('type: concert') || lowerTitle.includes('concert')) type = 'concert';
                        else if (lowerDesc.includes('type: repetition') || lowerTitle.includes('répétition')) type = 'repetition';

                        return {
                            id: evt.id,
                            title: evt.summary,
                            start: new Date(evt.start?.dateTime || evt.start?.date),
                            end: new Date(evt.end?.dateTime || evt.end?.date),
                            location: evt.location || '',
                            type: type
                        };
                    });

                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'agenda :", error);
            }
        };

        fetchEvents();
    }, [isAuthenticated]);

    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad';
        if (event.type === 'concert') backgroundColor = '#dc2626';
        else if (event.type === 'repetition') backgroundColor = '#ea580c';
        else if (event.type === 'indispo') backgroundColor = '#52525b';

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                display: 'block',
                fontWeight: 'bold',
                fontSize: '11px',
                padding: '2px 5px',
                cursor: 'pointer'
            }
        };
    };

    // ── GESTION DES PLACEHOLDERS DYNAMIQUES ──
    const getPlaceholder = () => {
        if (newEvent.type === 'indispo') {
            return "Ex: ❌ Indispo - Romain";
        }
        if (newEvent.type === 'repetition') {
            return "Ex: Répétition";
        }
        if (newEvent.type === 'concert') {
            return "Ex: Concert Sanary";
        }
        return "Titre de l'événement";
    };

    // ── ACTIONS SUR LE CALENDRIER ──
    const handleOpenModalForCreate = () => {
        setEditingId(null);
        setNewEvent({
            title: isAdmin ? '' : `❌ Indispo - ${user?.firstname || 'Membre'}`,
            start: '',
            end: '',
            location: '',
            type: 'indispo'
        });
        setIsModalOpen(true);
    };

    const handleSelectSlot = (slotInfo) => {
        setEditingId(null);
        setNewEvent({
            title: isAdmin ? '' : `❌ Indispo - ${user?.firstname || 'Membre'}`,
            start: formatForInput(slotInfo.start),
            end: formatForInput(slotInfo.end || slotInfo.start),
            location: '',
            type: 'indispo'
        });
        setIsModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        setEditingId(event.id);

        let cleanTitle = event.title ? String(event.title) : '';
        if (event.type === 'concert' && cleanTitle.includes('📍')) {
            cleanTitle = cleanTitle.split(' 📍 ')[0];
        }

        setNewEvent({
            title: cleanTitle,
            start: formatForInput(event.start),
            end: formatForInput(event.end),
            location: event.location || '',
            type: event.type || 'indispo'
        });

        setIsModalOpen(true);
    };

    // ── GESTION DE LA SUPPRESSION ──
    const handleDelete = async () => {
        if (!editingId) return;

        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/calendar/${editingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setEvents(events.filter(e => e.id !== editingId));
                    setIsModalOpen(false);
                } else {
                    throw new Error("Erreur serveur lors de la suppression");
                }
            } catch (error) {
                console.error(error);
                alert("Une erreur est survenue lors de la suppression.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const startDate = new Date(newEvent.start);

        if (isNaN(startDate.getTime())) {
            alert("Attention : La date de début est obligatoire.");
            setIsSubmitting(false);
            return;
        }

        let endDate = newEvent.end ? new Date(newEvent.end) : null;

        if (!endDate || isNaN(endDate.getTime())) {
            endDate = new Date(startDate);
            if (newEvent.type === 'indispo') {
                endDate.setHours(23, 59, 59);
            } else {
                endDate.setHours(startDate.getHours() + 7);
            }
        }

        if (endDate <= startDate) {
            alert("Attention : La date de fin doit être ultérieure à la date de début.");
            setIsSubmitting(false);
            return;
        }

        let finalTitle = newEvent.title || '';
        let safeLocation = newEvent.location || '';

        if (newEvent.type === 'concert' && safeLocation.trim() !== '') {
            finalTitle = `${finalTitle} 📍 ${safeLocation.trim()}`;
        }

        // ── ENVOI DES DONNÉES AU BACKEND ──
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/calendar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: finalTitle,
                    location: safeLocation,
                    description: `Type: ${isAdmin ? newEvent.type : 'indispo'}`,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'enregistrement sur Google Agenda");
            }

            const result = await response.json();

            const eventToSave = {
                id: result.event.id,
                title: result.event.summary,
                start: new Date(result.event.start?.dateTime || startDate),
                end: new Date(result.event.end?.dateTime || endDate),
                type: isAdmin ? newEvent.type : 'indispo',
                location: result.event.location || ''
            };

            if (editingId) {
                setEvents(events.map(e => e.id === editingId ? eventToSave : e));
            } else {
                setEvents([...events, eventToSave]);
            }

            setIsModalOpen(false);

        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="mt-[80px] min-h-[50vh] flex items-center justify-center text-black dark:text-white">
                <p>Accès restreint aux membres du groupe.</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Reservoir Rock | Agenda Partagé</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Injection des Overrides CSS pour améliorer le mode sombre et ajouter le bouton + au survol */}
            <style>{`
                .dark .rbc-toolbar button {
                    color: #ffffff !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                }
                .dark .rbc-toolbar button:hover, .dark .rbc-toolbar button:focus {
                    color: #ffffff !important;
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }
                .dark .rbc-toolbar button.rbc-active {
                    background-color: #dc2626 !important;
                    color: #ffffff !important;
                    border-color: #dc2626 !important;
                }
                .dark .rbc-toolbar .rbc-toolbar-label {
                    color: #ffffff !important;
                }
                .dark .rbc-month-view, .dark .rbc-time-view, .dark .rbc-agenda-view {
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
                .dark .rbc-day-bg + .rbc-day-bg, .dark .rbc-month-row + .rbc-month-row {
                    border-left-color: rgba(255, 255, 255, 0.1) !important;
                    border-top-color: rgba(255, 255, 255, 0.1) !important;
                }
                .dark .rbc-header {
                    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                }
                
                /* ─── EFFET SURVOL : BOUTON "+" ROUGE DANS LES CASES ─── */
                .rbc-day-bg {
                    position: relative;
                }
                .rbc-day-bg:hover::after {
                    content: "+";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #dc2626; /* Le rouge de ta charte */
                    color: #ffffff;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    font-weight: bold;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    pointer-events: none; /* Le clic traverse le "+" pour valider la sélection de la date */
                    z-index: 10;
                }
            `}</style>

            <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black text-black dark:text-white font-sans p-4 md:p-8 relative">
                <div className="max-w-[1200px] mx-auto">

                    <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                        <div>
                            <h1 className="text-3xl font-[300] uppercase tracking-widest text-black dark:text-white">
                                Agenda <span className="font-black text-primary">Partagé</span>
                            </h1>
                            <p className="text-xs font-black uppercase tracking-[3px] text-gray-500 mt-2">
                                Gestion des dates & indisponibilités
                            </p>
                        </div>

                        <button
                            onClick={handleOpenModalForCreate}
                            className="bg-primary text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                            + Nouvel Événement
                        </button>
                    </div>

                    <div className="flex gap-4 mb-6 text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded"></div> Concerts</span>
                        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-600 rounded"></div> Répétitions</span>
                        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-600 rounded"></div> Indisponibilités</span>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-200 dark:border-white/5 h-[600px] shadow-sm">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            culture="fr"
                            selectable={true}
                            onSelectSlot={handleSelectSlot}
                            date={currentDate}
                            onNavigate={(newDate) => setCurrentDate(newDate)}
                            view={currentView}
                            onView={(newView) => setCurrentView(newView)}
                            messages={{
                                next: "Suivant",
                                previous: "Précédent",
                                today: "Aujourd'hui",
                                month: "Mois",
                                week: "Semaine",
                                day: "Jour",
                                agenda: "Planning"
                            }}
                            eventPropGetter={eventStyleGetter}
                            onSelectEvent={handleSelectEvent}
                            className="dark:text-white cursor-pointer"
                        />
                    </div>
                </div>

                {/* MODALE */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">

                            <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                                {editingId
                                    ? (isAdmin ? "Modifier l'événement" : "Détails de l'événement")
                                    : (isAdmin ? "Ajouter une date" : "Déclarer une indisponibilité")
                                }
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {isAdmin && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Type d'événement</label>
                                        <select
                                            value={newEvent.type}
                                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-sm text-black dark:text-white focus:border-primary focus:outline-none transition-colors appearance-none"
                                        >
                                            <option value="indispo" className="bg-white dark:bg-[#111] text-black dark:text-white">Indisponibilité</option>
                                            <option value="repetition" className="bg-white dark:bg-[#111] text-black dark:text-white">Répétition</option>
                                            <option value="concert" className="bg-white dark:bg-[#111] text-black dark:text-white">Concert</option>
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Titre de l'événement</label>
                                    <input
                                        type="text"
                                        readOnly={!isAdmin && newEvent.type === 'concert'}
                                        required
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        placeholder={getPlaceholder()}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-sm text-black dark:text-white focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                {newEvent.type === 'concert' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Lieu / Adresse</label>
                                        {isAdmin ? (
                                            <input
                                                type="text"
                                                value={newEvent.location}
                                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                                placeholder="Ex: rue de la Mairie, 83110 Sanary"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-sm text-black dark:text-white focus:border-primary focus:outline-none transition-colors"
                                            />
                                        ) : (
                                            <div className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-sm text-black dark:text-white flex justify-between items-center">
                                                <span>{newEvent.location || "Aucune adresse indiquée"}</span>
                                                {newEvent.location && (
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newEvent.location)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline text-[11px] font-black uppercase tracking-wider ml-2 flex items-center gap-1 shrink-0"
                                                    >
                                                        🗺️ Voir l'itinéraire
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Début</label>
                                        <input
                                            type="datetime-local"
                                            readOnly={!isAdmin && newEvent.type === 'concert'}
                                            required
                                            value={newEvent.start}
                                            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-sm text-black dark:text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                                            Fin <span className="text-gray-400 font-normal lowercase">(Optionnel)</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            readOnly={!isAdmin && newEvent.type === 'concert'}
                                            value={newEvent.end}
                                            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-lg text-sm text-black dark:text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    {isAdmin && editingId && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="flex-none bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-gray-100 dark:bg-white/5 text-black dark:text-white px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Fermer
                                    </button>

                                    {(isAdmin || newEvent.type !== 'concert') && (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`flex-1 text-white px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-black dark:hover:bg-white dark:hover:text-black'}`}
                                        >
                                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Agenda;