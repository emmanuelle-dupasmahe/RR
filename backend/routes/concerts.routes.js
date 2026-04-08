// routes/concerts.routes.js
import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Récupérer tous les concerts
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const countResult = await query('SELECT COUNT(*) as total FROM concerts WHERE date_concert >= CURDATE()');
        const total = countResult[0].total;

        const sql = 'SELECT * FROM concerts WHERE date_concert >= CURDATE() ORDER BY date_concert ASC LIMIT ? OFFSET ?';
        const concerts = await query(sql, [limit, offset]);

        res.json({ concerts, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des concerts' });
    }
});
// Ajouter un concert
router.post('/', authMiddleware, async (req, res) => {
    const { titre, date_concert, heure, lieu } = req.body;

    // Empêcher l'ajout d'un concert dans le passé (comparaison de chaînes YYYY-MM-DD)
    const today = new Date().toLocaleDateString('en-CA');
    if (date_concert < today) {
        return res.status(400).json({ error: "La date du concert ne peut pas être dans le passé." });
    }

    try {
        const sql = 'INSERT INTO concerts (titre, date_concert, heure, lieu) VALUES (?, ?, ?, ?)';
        await query(sql, [titre, date_concert, heure, lieu]);
        res.status(201).json({ message: 'Concert ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le concert' });
    }
});


// Modifier un concert
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, date_concert, heure, lieu } = req.body;

        // Validation simple pour s'assurer que les champs requis sont présents
        if (!titre || !date_concert || !heure || !lieu) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        }

        const sql = `
            UPDATE concerts 
            SET titre = ?, date_concert = ?, heure = ?, lieu = ? 
            WHERE id = ?
        `;

        const result = await query(sql, [titre, date_concert, heure, lieu, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Concert non trouvé' });
        }

        res.json({ message: 'Concert mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
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