import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Récupérer une valeur par sa clé
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const results = await query('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
        if (results.length > 0) {
            res.json({ value: results[0].setting_value });
        } else {
            res.status(404).json({ error: 'Réglage non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Mettre à jour une valeur (Admin uniquement)
router.post('/:key', authMiddleware, async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Interdit' });
        await query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
        res.json({ message: 'Réglage mis à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;