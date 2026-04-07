// routes/repetitions.routes.js
import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Récupérer tous les morceaux (ordre du plus récent au plus ancien)
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT * FROM repetitions ORDER BY id DESC';
        const repetitions = await query(sql);
        res.json(repetitions);
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des répétitions' });
    }
});

// Ajouter un morceau
router.post('/', authMiddleware, async (req, res) => {
    const { titre, detail, url } = req.body;
    try {
        const sql = 'INSERT INTO repetitions (titre, detail, url) VALUES (?, ?, ?)';
        await query(sql, [titre, detail, url]);
        res.status(201).json({ message: 'Morceau ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le morceau' });
    }
});

// Supprimer un morceau
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM repetitions WHERE id = ?', [id]);
        res.json({ message: 'Morceau supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du morceau' });
    }
});

export default router;