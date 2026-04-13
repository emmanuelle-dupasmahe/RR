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

        // On ne compte que les messages PUBLICS
        const countResult = await query('SELECT COUNT(*) as total FROM guestbook WHERE is_private = 0');
        const total = countResult[0].total;

        // On ne récupère que les messages PUBLICS
        const sql = `
            SELECT g.*, u.firstname 
            FROM guestbook g 
            LEFT JOIN users u ON g.user_id = u.id 
            WHERE g.is_private = 0 
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
        res.status(500).json({ error: 'Erreur récupération messages' });
    }
});

// Poster un message (protégé par auth)
router.post('/', authMiddleware, async (req, res) => {
    const { content, is_private } = req.body;
    const userId = req.user.id;

    const privateValue = is_private ? 1 : 0;

    try {
        const sql = 'INSERT INTO guestbook (user_id, content, is_private) VALUES (?, ?, ?)';
        await query(sql, [userId, content, privateValue]);
        res.status(201).json({ message: 'Message ajouté !' });
    } catch (error) {
        console.error('Erreur POST Livredor:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le message' });
    }
});

// Route pour répondre à un message du Livre d'Or
router.put('/:id/reponse', async (req, res) => {
    const { id } = req.params;
    const { reponse } = req.body;


    const sql = "UPDATE guestbook SET reponse = ? WHERE id = ?";

    try {
        await query(sql, [reponse, id]);
        res.status(200).json({ message: "Réponse publiée avec succès !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

//afin que l'admin puisse récupérer tous les messages dans le dashboard
router.get('/admin/all', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const sql = `
            SELECT g.*, u.firstname, u.email 
            FROM guestbook g 
            LEFT JOIN users u ON g.user_id = u.id 
            ORDER BY g.created_at DESC
        `;
        const messages = await query(sql);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
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