import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET : Récupérer tous les membres
router.get('/', async (req, res) => {
    try {
        const q = "SELECT * FROM membres ORDER BY ordre_affichage ASC";
        const data = await query(q); // Utilisation de await avec query
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST : Ajouter un membre
router.post('/', authMiddleware, async (req, res) => {
    const { nom, instrument, photo_url, ordre_affichage } = req.body;
    if (!nom || !instrument) {
        return res.status(400).json({ error: "Le nom et l'instrument sont obligatoires" });
    }
    try {
        const q = "INSERT INTO membres (nom, instrument, photo_url, ordre_affichage) VALUES (?, ?, ?, ?)";
        await query(q, [nom, instrument, photo_url, ordre_affichage || 0]);
        res.json({ message: "Membre ajouté avec succès" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST : Modifier un membre
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nom, instrument, photo_url, ordre_affichage } = req.body;
    try {
        const q = `
            UPDATE membres 
            SET nom = ?, instrument = ?, photo_url = ?, ordre_affichage = ? 
            WHERE id = ?
        `;
        await query(q, [nom, instrument, photo_url, ordre_affichage, id]);
        res.json({ message: "Membre mis à jour" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE : Supprimer un membre
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const q = "DELETE FROM membres WHERE id = ?";
        const result = await query(q, [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Membre non trouvé" });
        }
        res.json({ message: "Membre supprimé" });
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;