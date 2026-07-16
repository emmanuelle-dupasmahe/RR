import * as calendarService from '../services/calendar.service.js';

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

        const newEvent = await calendarService.addEvent({
            title,
            location,
            description,
            startDate,
            endDate
        });

        res.status(201).json({ message: 'Événement ajouté avec succès à Google Agenda', event: newEvent });
    } catch (error) {
        console.error('Erreur contrôleur createEvent:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
    }
};
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await calendarService.removeEvent(id); // On appelle la fonction qu'on va créer
        res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
        console.error('Erreur contrôleur deleteEvent:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};