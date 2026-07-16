// controllers/settings.controller.js
import Setting from '../models/setting.model.js';

// GET /api/settings/:key
export const getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const result = await Setting.findByKey(key);

        if (!result) {
            return res.status(404).json({ error: 'Réglage non trouvé' });
        }

        res.json({ value: result.setting_value });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// POST /api/settings/:key
export const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        // Vérifier les permissions (admin uniquement)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        // Validations
        if (value === undefined || value === null) {
            return res.status(400).json({ error: 'La valeur est obligatoire' });
        }

        await Setting.update(key, value);
        res.json({ message: 'Réglage mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
