// controllers/offre.controller.js
import Offre from '../models/offre.model.js';

// GET /api/offres (Avec option de filtre : /api/offres?active=true)
export const getAllOffres = async (req, res) => {
    try {
        // Si true, on ne renvoie que les offres actives (pour le site public)
        const onlyActive = req.query.active === 'true';
        const offres = await Offre.findAll(onlyActive);
        res.json({ offres });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
    }
};

// POST /api/offres
export const createOffre = async (req, res) => {
    try {
        const { titre, description, prix, is_active } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!titre || !description) {
            return res.status(400).json({ error: 'Le titre et la description sont obligatoires' });
        }

        // On gère la conversion de la case à cocher (true/false) en 1 ou 0 pour MySQL
        const active = (is_active === 'false' || is_active === '0') ? 0 : 1;

        await Offre.create(titre, description, prix || 'Sur devis', image_url, active);
        res.status(201).json({ message: 'Offre créée avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible de créer l\'offre' });
    }
};

// PUT /api/offres/:id
export const updateOffre = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, description, prix, is_active, existing_image } = req.body;

        if (!titre || !description) {
            return res.status(400).json({ error: 'Le titre et la description sont obligatoires' });
        }

        // Si une nouvelle image est uploadée, on l'utilise, sinon on garde l'ancienne (existing_image)
        const image_url = req.file ? `/uploads/${req.file.filename}` : (existing_image || null);
        const active = (is_active === 'false' || is_active === '0') ? 0 : 1;

        const success = await Offre.update(id, titre, description, prix, image_url, active);

        if (!success) {
            return res.status(404).json({ error: 'Offre non trouvée' });
        }

        res.json({ message: 'Offre mise à jour avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
};

// DELETE /api/offres/:id
export const deleteOffre = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Offre.delete(id);

        if (!success) {
            return res.status(404).json({ error: 'Offre non trouvée' });
        }

        res.json({ message: 'Offre supprimée avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};