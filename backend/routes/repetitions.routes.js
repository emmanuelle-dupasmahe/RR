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
    if (!titre) {
        return res.status(400).json({ error: "Le titre est obligatoire" });
    }
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

// Modifier un morceau
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { titre, detail, url } = req.body;
    try {
        const sql = `
            UPDATE repetitions 
            SET titre = ?, detail = ?, url = ?
            WHERE id = ?
        `;
        await query(sql, [titre, detail, url, id]);
        res.json({ message: 'Morceau mis à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

// Supprimer un morceau
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM repetitions WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Morceau non trouvé" });
        }
        res.json({ message: 'Morceau supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du morceau' });
    }
});

export default router;