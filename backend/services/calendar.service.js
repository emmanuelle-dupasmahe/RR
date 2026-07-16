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
// const CALENDAR_ID = 'danceny83@gmail.com';
const CALENDAR_ID = '7f063ec0a2ede0e96bc8821ef7fac095dca0a63be1848ee9a701451281b92014@group.calendar.google.com';

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
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return response.data.items;
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