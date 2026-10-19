// controllers/concerts.controller.js
import Concert from '../models/concert.model.js';

// GET /api/concerts
export const getAllConcerts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const total = await Concert.countFuture();
        const concerts = await Concert.findAllFuture(limit, offset);

        res.json({
            concerts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des concerts' });
    }
};

// POST /api/concerts
export const createConcert = async (req, res) => {
    const { titre, date_concert, heure, lieu, adresse, telephone, statut } = req.body;
    const flyer_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Validations
    if (!titre || !date_concert || !heure || !lieu) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Logique métier : vérifier que la date n'est pas dans le passé
    const today = new Date().toLocaleDateString('en-CA');
    if (date_concert < today) {
        return res.status(400).json({ error: "La date du concert ne peut pas être dans le passé." });
    }

    try {
        await Concert.create(
            titre,
            date_concert,
            heure,
            lieu,
            adresse || '',
            telephone || '',
            statut || 'Entrée libre',
            flyer_url
        );
        res.status(201).json({ message: 'Concert ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le concert' });
    }
};

// PUT /api/concerts/:id
export const updateConcert = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url: existingFlyer } = req.body;
        const flyer_url = req.file ? `/uploads/${req.file.filename}` : (existingFlyer || null);

        // Validations
        if (!titre || !date_concert || !heure || !lieu) {
            return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
        }

        // Vérifier que le concert existe
        const concert = await Concert.findById(id);
        if (!concert) {
            return res.status(404).json({ error: 'Concert non trouvé' });
        }

        await Concert.update(
            id,
            titre,
            date_concert,
            heure,
            lieu,
            adresse || '',
            telephone || '',
            statut || 'Entrée libre',
            flyer_url
        );
        res.json({ message: 'Concert mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
};

// DELETE /api/concerts/:id
export const deleteConcert = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que le concert existe
        const concert = await Concert.findById(id);
        if (!concert) {
            return res.status(404).json({ error: 'Concert non trouvé' });
        }

        await Concert.delete(id);
        res.json({ message: 'Concert supprimé avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
