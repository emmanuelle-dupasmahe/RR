// routes/repetitions.routes.js
import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Récupérer tous les morceaux (ordre du plus récent au plus ancien)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countResult = await query('SELECT COUNT(*) as total FROM repetitions');
        const total = countResult[0].total;

        const sql = 'SELECT * FROM repetitions ORDER BY id DESC LIMIT ? OFFSET ?';
        const repetitions = await query(sql, [limit, offset]);

        res.json({ repetitions, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des répétitions' });
    }
});

// Ajouter un morceau
router.post('/', authMiddleware, upload.single('audio'), async (req, res) => {
    const { titre, detail, url } = req.body;
    let finalUrl = url;
    let fileName = null, fileSize = null, mimeType = null;

    if (req.file) {
        finalUrl = `/uploads/${req.file.filename}`;
        fileName = req.file.originalname;
        fileSize = req.file.size;
        mimeType = req.file.mimetype;
    }

    try {
        const sql = 'INSERT INTO repetitions (titre, detail, url, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)';
        await query(sql, [titre, detail, finalUrl, fileName, fileSize, mimeType]);
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