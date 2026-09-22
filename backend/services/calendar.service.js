import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEYFILEPATH = path.join(__dirname, '../google-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;


export const addEvent = async (eventDetails) => {
    try {
        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            requestBody: {
                summary: eventDetails.title,
                location: eventDetails.location,
                description: eventDetails.description,
                start: {
                    dateTime: eventDetails.startDate,
                    timeZone: 'Europe/Paris',
                },
                end: {
                    dateTime: eventDetails.endDate,
                    timeZone: 'Europe/Paris',
                },
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec Google Calendar :', error);
        throw error;
    }
};

export const getUpcomingEvents = async () => {
    try {
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            // On enlève q: 'concert' pour que Google nous renvoie tout le calendrier sans restriction
            maxResults: 2500,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const now = new Date();

        // On filtre intelligemment les résultats en JavaScript
        const filteredEvents = response.data.items.filter(event => {
            // On récupère la date de l'événement (gère les événements sur une journée entière ou avec heure précise)
            const eventDate = new Date(event.start.dateTime || event.start.date);


            // On cherche le mot "concert" de façon large, soit dans le titre, soit dans la description
            const titleMatch = event.summary && event.summary.toLowerCase().includes('concert');
            const descMatch = event.description && event.description.toLowerCase().includes('concert');
            const isConcert = titleMatch || descMatch;

            // Règle : on conserve l'événement SI c'est dans le futur (indispos, réunions...) OU SI c'est un concert
            return eventDate >= now || isConcert;
        });

        return filteredEvents;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'agenda :', error);
        throw error;
    }
};

export const removeEvent = async (eventId) => {
    try {
        await calendar.events.delete({
            calendarId: CALENDAR_ID,
            eventId: eventId,
        });
    } catch (error) {
        console.error('Erreur lors de la suppression sur Google Calendar :', error);
        throw error;
    }
};

export const editEvent = async (eventId, eventDetails) => {
    try {
        const response = await calendar.events.update({
            calendarId: CALENDAR_ID,
            eventId: eventId,
            requestBody: {
                summary: eventDetails.title,
                location: eventDetails.location,
                description: eventDetails.description,
                start: {
                    dateTime: eventDetails.startDate,
                    timeZone: 'Europe/Paris',
                },
                end: {
                    dateTime: eventDetails.endDate,
                    timeZone: 'Europe/Paris',
                },
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour sur Google Calendar :', error);
        throw error;
    }
};