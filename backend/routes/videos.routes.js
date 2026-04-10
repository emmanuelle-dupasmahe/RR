import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countResult = await query('SELECT COUNT(*) as total FROM videos');
        const total = countResult[0].total;

        const sql = 'SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const videos = await query(sql, [limit, offset]);

        res.json({ videos, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des vidéos' });
    }
});

router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
    const { titre, description, url_youtube } = req.body;
    if (!titre) {
        return res.status(400).json({ error: "Le titre de la vidéo est obligatoire" });
    }
    let filePath = null, fileName = null, fileSize = null, mimeType = null;

    if (req.file) {
        filePath = `/uploads/${req.file.filename}`;
        fileName = req.file.originalname;
        fileSize = req.file.size;
        mimeType = req.file.mimetype;
    }

    try {
        const sql = `
            INSERT INTO videos (titre, description, url_youtube, file_path, file_name, file_size, mime_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await query(sql, [titre, description, url_youtube || null, filePath, fileName, fileSize, mimeType]);
        res.status(201).json({ message: 'Vidéo ajoutée !' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Impossible d\'ajouter la vidéo' });
    }
});

// Modifier une vidéo
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { titre, description, url_youtube } = req.body;
    try {
        const sql = `
            UPDATE videos 
            SET titre = ?, description = ?, url_youtube = ?
            WHERE id = ?
        `;
        const result = await query(sql, [titre, description, url_youtube, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Vidéo non trouvée" });
        res.json({ message: 'Vidéo mise à jour' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;


        const result = await query('DELETE FROM videos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Vidéo non trouvée" });
        }
        res.json({ message: 'Vidéo supprimée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

export default router;