// routes/concerts.routes.js
import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Récupérer tous les concerts
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM concerts ORDER BY date_concert ASC';
        const concerts = await query(sql);
        res.json(concerts);
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des concerts' });
    }
});
// Ajouter un concert
router.post('/', authMiddleware, async (req, res) => {
    const { titre, date_concert, heure, lieu } = req.body;

    try {
        const sql = 'INSERT INTO concerts (titre, date_concert, heure, lieu) VALUES (?, ?, ?, ?)';
        await query(sql, [titre, date_concert, heure, lieu]);
        res.status(201).json({ message: 'Concert ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le concert' });
    }
});
// Supprimer un concert
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM concerts WHERE id = ?', [id]);
        res.json({ message: 'Concert supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});
export default router;