// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import concertRoutes from './routes/concerts.routes.js';
import repetitionRoutes from './routes/repetitions.routes.js';
import livredorRoutes from './routes/livredor.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import videoRoutes from './routes/videos.routes.js';
import membresRoutes from './routes/membres.routes.js';
import groupeSettingsRoutes from './routes/groupesettings.routes.js';
import calendarRoutes from './routes/calendar.routes.js'; // <-- NOUVEL IMPORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Configuration CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://resrock.fr'
        : ['http://localhost:5173', 'http://localhost:3000', 'http://10.0.0.10:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Connexion BDD
testConnection();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ← chemin absolu

// Logger en développement uniquement
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
        next();
    });
}

// Routes API
app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true, service: 'rr-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/repetitions', repetitionRoutes);
app.use('/api/guestbook', livredorRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/membres', membresRoutes);
app.use('/api/groupesettings', groupeSettingsRoutes);
app.use('/api/calendar', calendarRoutes); // <-- NOUVELLE ROUTE

// Frontend build (static + SPA fallback)
const frontendDistPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendDistPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('sw.js')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
        if (filePath.endsWith('sitemap.xml')) {
            res.setHeader('Content-Type', 'application/xml');
        }
    }
}));

// Fallback SPA — toutes les routes inconnues renvoient index.html
app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Démarrage
app.listen(PORT, HOST, () => {
    console.log(`Serveur sur http://${HOST}:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});