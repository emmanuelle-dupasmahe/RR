import * as calendarService from '../services/calendar.service.js';
import Concert from '../models/concert.model.js';

// ── FONCTION UTILITAIRE POUR PARSER LES DONNÉES DU CONCERT ──
const parseConcertData = (title, description, startDate, location) => {
    const isConcert = description && description.toLowerCase().includes('type: concert');
    if (!isConcert) return null;

    const publicTimeMatch = description.match(/Heure public:\s*([0-9]{2}:[0-9]{2})/);
    const heure = publicTimeMatch ? publicTimeMatch[1] : new Date(startDate).toTimeString().substring(0, 5);

    const dateObj = new Date(startDate);
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
    const date_concert = dateObj.toISOString().split('T')[0];

    let cleanTitle = title;
    if (cleanTitle.includes(' 📍 ')) {
        cleanTitle = cleanTitle.split(' 📍 ')[0];
    }

    return {
        titre: cleanTitle,
        date_concert,
        heure,
        lieu: location || 'Lieu à définir',
        adresse: location || ''
    };
};

export const getEvents = async (req, res) => {
    try {
        const events = await calendarService.getUpcomingEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error('Erreur contrôleur getEvents:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'agenda' });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, location, description, startDate, endDate } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ message: 'Le titre, la date de début et de fin sont obligatoires.' });
        }

        // 1. Sauvegarde dans Google Agenda
        const newEvent = await calendarService.addEvent({ title, location, description, startDate, endDate });

        // 2. Synchronisation en base de données MySQL
        const concertData = parseConcertData(title, description, startDate, location);

        if (concertData) {
            await Concert.createFromGoogle(
                newEvent.id,
                concertData.titre,
                concertData.date_concert,
                concertData.heure,
                concertData.lieu,
                concertData.adresse
            );
        }

        res.status(201).json({ message: 'Événement ajouté avec succès', event: newEvent });
    } catch (error) {
        console.error('Erreur contrôleur createEvent:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, description, startDate, endDate } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ message: 'Le titre, la date de début et de fin sont obligatoires.' });
        }

        const updatedEvent = await calendarService.editEvent(id, { title, location, description, startDate, endDate });

        const concertData = parseConcertData(title, description, startDate, location);

        if (concertData) {
            const existingConcert = await Concert.findByGoogleId(id);
            if (existingConcert) {
                await Concert.updateFromGoogle(id, concertData.titre, concertData.date_concert, concertData.heure, concertData.lieu, concertData.adresse);
            } else {
                await Concert.createFromGoogle(id, concertData.titre, concertData.date_concert, concertData.heure, concertData.lieu, concertData.adresse);
            }
        } else {
            await Concert.deleteByGoogleId(id);
        }

        res.status(200).json({ message: 'Événement mis à jour avec succès', event: updatedEvent });
    } catch (error) {
        console.error('Erreur contrôleur updateEvent:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await calendarService.removeEvent(id);
        await Concert.deleteByGoogleId(id);
        res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
        console.error('Erreur contrôleur deleteEvent:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};