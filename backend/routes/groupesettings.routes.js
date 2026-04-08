import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET : Récupérer tous les textes du groupe
router.get('/', async (req, res) => {
    try {
        const results = await query('SELECT * FROM group_settings');

        // On transforme le tableau en objet { key: value } pour faciliter l'usage côté Front
        const settings = {};
        results.forEach(row => {
            settings[row.key_name] = row.value_text;
        });

        res.json(settings);
    } catch (err) {
        console.error('Erreur SQL (group_settings):', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des textes du groupe' });
    }
});

// POST : Mettre à jour un texte spécifique (Protégé)
router.post('/', authMiddleware, async (req, res) => {
    const { key_name, value_text } = req.body;

    if (!key_name) {
        return res.status(400).json({ error: "Le nom de la clé est manquant" });
    }

    try {
        const q = "UPDATE group_settings SET value_text = ? WHERE key_name = ?";
        const result = await query(q, [value_text, key_name]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Paramètre non trouvé" });
        }

        res.json({ message: `Champ ${key_name} mis à jour avec succès` });
    } catch (err) {
        console.error('Erreur SQL (update group_settings):', err);
        res.status(500).json({ error: 'Impossible de mettre à jour le texte' });
    }
});

export default router;