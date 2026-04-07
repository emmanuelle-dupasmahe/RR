import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Récupérer tous les messages avec le nom de l'auteur
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; // 5 messages par page
        const offset = (page - 1) * limit;

        // Récupérer le nombre total de messages pour calculer le nombre de pages
        const countResult = await query('SELECT COUNT(*) as total FROM guestbook');
        const total = countResult[0].total;

        const sql = `
            SELECT g.*, u.firstname 
            FROM guestbook g 
            JOIN users u ON g.user_id = u.id 
            ORDER BY g.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const messages = await query(sql, [limit, offset]);
        res.json({
            messages,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erreur GET Livredor:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
});

// Poster un message (protégé par auth)
router.post('/', authMiddleware, async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    try {
        const sql = 'INSERT INTO guestbook (user_id, content) VALUES (?, ?)';
        await query(sql, [userId, content]);
        res.status(201).json({ message: 'Message ajouté !' });
    } catch (error) {
        console.error('Erreur POST Livredor:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le message' });
    }
});

// Supprimer un message (Admin uniquement)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
        }
        await query('DELETE FROM guestbook WHERE id = ?', [id]);
        res.json({ message: 'Message supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
    }
});

export default router;