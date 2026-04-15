// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import concertRoutes from './routes/concerts.routes.js';
import repetitionRoutes from './routes/repetitions.routes.js';
import livredorRoutes from './routes/livredor.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import videoRoutes from './routes/videos.routes.js';
import membresRoutes from './routes/membres.routes.js';
import groupeSettingsRoutes from './routes/groupesettings.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion BDD
testConnection();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Logger (dev)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
        next();
    });
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Reservoir Rock', status: 'online' });
});

/*
POST  /api/auth/register
POST  /api/auth/login
GET  /api/auth/me
*/
app.use('/api/auth', authRoutes);
app.use('/api/concerts', concertRoutes);
app.use('/api/repetitions', repetitionRoutes);
app.use('/api/guestbook', livredorRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/membres', membresRoutes);
app.use('/api/groupesettings', groupeSettingsRoutes);
// 404
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée' }));

// Démarrage
app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});