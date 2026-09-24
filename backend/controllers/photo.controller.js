// controllers/photo.controller.js
import Photo from '../models/photo.model.js';

// GET /api/photos
export const getAllPhotos = async (req, res) => {
    try {
        const photos = await Photo.findAll();
        res.json({ photos });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des photos' });
    }
};

// POST /api/photos
export const createPhoto = async (req, res) => {
    try {
        const { description, ordre } = req.body;

        // On vérifie qu'une image a bien été envoyée par le formulaire (via Multer)
        if (!req.file) {
            return res.status(400).json({ error: 'L\'image est obligatoire' });
        }

        const url_photo = `/uploads/${req.file.filename}`;

        await Photo.create(url_photo, description || '', ordre || 0);
        res.status(201).json({ message: 'Photo ajoutée avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter la photo' });
    }
};

// DELETE /api/photos/:id
export const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Photo.delete(id);

        if (!success) {
            return res.status(404).json({ error: 'Photo non trouvée' });
        }

        res.json({ message: 'Photo supprimée avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};