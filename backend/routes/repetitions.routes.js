// routes/repetitions.routes.js
import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Récupérer les morceaux (Filtrage Public/Privé automatique)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let userRole = 'guest';
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userRole = decoded.role;
            } catch (err) {
                // Token invalide
            }
        }

        let sql, countSql;
        let params = [limit, offset];

        if (userRole === 'admin' || userRole === 'member') {
            countSql = 'SELECT COUNT(*) as total FROM repetitions';
            // Le SELECT * inclura automatiquement la nouvelle colonne markers
            sql = 'SELECT * FROM repetitions ORDER BY id DESC LIMIT ? OFFSET ?';
        } else {
            countSql = 'SELECT COUNT(*) as total FROM repetitions WHERE status = "public"';
            sql = 'SELECT * FROM repetitions WHERE status = "public" ORDER BY id DESC LIMIT ? OFFSET ?';
        }

        const countResult = await query(countSql);
        const total = countResult[0].total;
        const repetitions = await query(sql, params);

        res.json({
            repetitions,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des répétitions' });
    }
});

// Ajouter un morceau
router.post('/', authMiddleware, upload.single('audio'), async (req, res) => {
    // Ajout de markers ici
    const { titre, detail, url, start_time, end_time, status, markers } = req.body;

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
        // MAJ SQL : Ajout de 'markers'
        const sql = `
            INSERT INTO repetitions 
            (titre, detail, url, file_name, file_size, mime_type, start_time, end_time, status, markers) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await query(sql, [
            titre,
            detail,
            finalUrl,
            fileName,
            fileSize,
            mimeType,
            start_time || 0,
            end_time || null,
            status || 'private',
            markers || null // On stocke la chaîne JSON ici
        ]);

        res.status(201).json({ message: 'Morceau ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le morceau' });
    }
});

// Modifier un morceau
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    // Ajout de markers ici
    const { titre, detail, url, start_time, end_time, status, markers } = req.body;

    try {
        const sql = `
            UPDATE repetitions 
            SET titre = ?, detail = ?, url = ?, start_time = ?, end_time = ?, status = ?, markers = ?
            WHERE id = ?
        `;
        await query(sql, [
            titre,
            detail,
            url,
            start_time || 0,
            end_time || null,
            status || 'private',
            markers || null, // Mise à jour des markers
            id
        ]);
        res.json({ message: 'Morceau mis à jour' });
    } catch (error) {
        console.error('Erreur SQL:', error);
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