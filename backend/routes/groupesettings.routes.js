import express from 'express';
import { query } from '../config/db.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js'; // Import nommé { upload }

const router = express.Router();

/**
 * GET : Récupérer tous les réglages du groupe
 * Utilisé sur la Home pour les textes et les images
 */
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

/**
 * POST : Mettre à jour un texte spécifique (Protégé par auth)
 * Utilisé pour les descriptions, noms, etc.
 */
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

/**
 * POST : Upload des images Hero (Desktop/Mobile)
 * URL : /api/groupesettings/hero/:key
 */
router.post('/hero/:key', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { key } = req.params; // 'hero_desktop' ou 'hero_mobile'
        
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu" });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        // Met à jour si la clé existe, sinon l'insère
        const q = `
            INSERT INTO group_settings (key_name, value_text) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE value_text = ?
        `;
        
        await query(q, [key, imagePath, imagePath]);

        res.json({ 
            success: true, 
            path: imagePath,
            message: `Image ${key} mise à jour avec succès` 
        });
    } catch (error) {
        console.error("Erreur Upload Hero:", error);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'image" });
    }
});

export default router;