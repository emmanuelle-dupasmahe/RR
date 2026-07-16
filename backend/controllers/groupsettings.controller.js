// controllers/groupsettings.controller.js
import GroupSetting from '../models/groupSetting.model.js';

// GET /api/groupsettings
export const getAllSettings = async (req, res) => {
    try {
        const settings = await GroupSetting.findAll();
        res.json(settings);
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des paramètres du groupe' });
    }
};

// POST /api/groupsettings
export const updateSetting = async (req, res) => {
    const { key_name, value_text } = req.body;

    // Validations
    if (!key_name) {
        return res.status(400).json({ error: "Le nom de la clé est manquant" });
    }

    try {
        // Vérifier que le paramètre existe
        const setting = await GroupSetting.findByKey(key_name);
        if (!setting) {
            return res.status(404).json({ error: "Paramètre non trouvé" });
        }

        await GroupSetting.update(key_name, value_text);
        res.json({ message: `Champ ${key_name} mis à jour avec succès` });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible de mettre à jour le paramètre' });
    }
};

// POST /api/groupsettings/hero/:key
export const uploadHeroImage = async (req, res) => {
    const { key } = req.params;

    // Validations
    if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier reçu" });
    }

    try {
        const imagePath = `/uploads/${req.file.filename}`;

        // Utiliser l'UPSERT pour insérer ou mettre à jour
        await GroupSetting.upsert(key, imagePath);

        res.json({
            success: true,
            path: imagePath,
            message: `Image ${key} mise à jour avec succès`
        });
    } catch (error) {
        console.error("Erreur Upload:", error);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'image" });
    }
};
