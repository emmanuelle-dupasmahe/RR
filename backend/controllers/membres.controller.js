// controllers/membres.controller.js
import Membre from '../models/membre.model.js';

// GET /api/membres
export const getAllMembres = async (req, res) => {
    try {
        const data = await Membre.findAll();
        res.json(data);
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des membres' });
    }
};

// POST /api/membres
export const createMembre = async (req, res) => {
    const { nom, instrument, ordre_affichage } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : '';

    // Validations
    if (!nom || !instrument) {
        return res.status(400).json({ error: "Le nom et l'instrument sont obligatoires" });
    }

    try {
        await Membre.create(nom, instrument, photo_url, ordre_affichage);
        res.status(201).json({ message: "Membre ajouté avec succès" });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du membre' });
    }
};

// PUT /api/membres/:id
export const updateMembre = async (req, res) => {
    const { id } = req.params;
    const { nom, instrument, photo_url: existingPhotoUrl, ordre_affichage } = req.body;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : (existingPhotoUrl || '');

    // Validations
    if (!nom || !instrument) {
        return res.status(400).json({ error: "Le nom et l'instrument sont obligatoires" });
    }

    try {
        // Vérifier que le membre existe
        const membre = await Membre.findById(id);
        if (!membre) {
            return res.status(404).json({ error: 'Membre non trouvé' });
        }

        await Membre.update(id, nom, instrument, photo_url, ordre_affichage);
        res.json({ message: "Membre mis à jour avec succès" });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
};

// DELETE /api/membres/:id
export const deleteMembre = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier que le membre existe
        const membre = await Membre.findById(id);
        if (!membre) {
            return res.status(404).json({ error: 'Membre non trouvé' });
        }

        await Membre.delete(id);
        res.json({ message: "Membre supprimé avec succès" });
    } catch (err) {
        console.error('Erreur SQL:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
