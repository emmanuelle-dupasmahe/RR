// controllers/videos.controller.js
import Video from '../models/video.model.js';

// GET /api/videos
export const getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const total = await Video.count();
        const videos = await Video.findAll(limit, offset);

        res.json({
            videos,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des vidéos' });
    }
};

// POST /api/videos
export const createVideo = async (req, res) => {
    const { titre, description, url_youtube } = req.body;

    // Validations strictes : le titre et l'URL YouTube sont désormais obligatoires
    if (!titre || !url_youtube) {
        return res.status(400).json({ error: "Le titre et le lien YouTube sont obligatoires" });
    }

    try {
        // On passe explicitement des valeurs nulles pour les anciens champs de fichiers
        // (Cela évite de devoir modifier ton modèle SQL tout de suite)
        await Video.create(titre, description, url_youtube, null, null, null, null);
        res.status(201).json({ message: 'Vidéo ajoutée avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter la vidéo' });
    }
};

// PUT /api/videos/:id
export const updateVideo = async (req, res) => {
    const { id } = req.params;
    const { titre, description, url_youtube } = req.body;

    // Validations
    if (!titre || !url_youtube) {
        return res.status(400).json({ error: "Le titre et le lien YouTube sont obligatoires" });
    }

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: "Vidéo non trouvée" });
        }

        await Video.update(id, titre, description, url_youtube);
        res.json({ message: 'Vidéo mise à jour avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
};

// DELETE /api/videos/:id
export const deleteVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ error: "Vidéo non trouvée" });
        }

        await Video.delete(id);
        res.json({ message: 'Vidéo supprimée avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};