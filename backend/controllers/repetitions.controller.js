// controllers/repetitions.controller.js
import Repetition from '../models/repetition.model.js';
import jwt from 'jsonwebtoken';

// GET /api/repetitions
export const getAllRepetitions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Déterminer le rôle de l'utilisateur
        let userRole = 'guest';
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userRole = decoded.role;
            } catch (err) {
                // Token invalide
            }
        }

        const { repetitions, total } = await Repetition.findByRole(userRole, limit, offset);

        res.json({
            repetitions,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des répétitions' });
    }
};

// POST /api/repetitions
export const createRepetition = async (req, res) => {
    const { titre, detail, url, start_time, end_time, status, markers } = req.body;

    // Validations
    if (!titre) {
        return res.status(400).json({ error: "Le titre est obligatoire" });
    }

    let finalUrl = url;
    let fileName = null, fileSize = null, mimeType = null;

    if (req.file) {
        finalUrl = `/uploads/${req.file.filename}`;
        fileName = req.file.originalname;
        fileSize = req.file.size;
        mimeType = req.file.mimetype;
    }

    try {
        await Repetition.create(
            titre,
            detail,
            finalUrl,
            fileName,
            fileSize,
            mimeType,
            start_time,
            end_time,
            status,
            markers
        );
        res.status(201).json({ message: 'Morceau ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le morceau' });
    }
};

// PUT /api/repetitions/:id
export const updateRepetition = async (req, res) => {
    const { id } = req.params;
    const { titre, detail, url, start_time, end_time, status, markers } = req.body;

    // Validations
    if (!titre) {
        return res.status(400).json({ error: "Le titre est obligatoire" });
    }

    let finalUrl = url;
    if (req.file) {
        finalUrl = `/uploads/${req.file.filename}`;
    }

    // Validation des timestamps
    const validatedStartTime = isNaN(parseInt(start_time)) ? 0 : parseInt(start_time);
    const validatedEndTime = (end_time === 'null' || end_time === '' || isNaN(parseInt(end_time))) ? null : parseInt(end_time);

    try {
        const repetition = await Repetition.findById(id);
        if (!repetition) {
            return res.status(404).json({ error: 'Répétition non trouvée' });
        }

        await Repetition.update(id, titre, detail, finalUrl, validatedStartTime, validatedEndTime, status, markers);
        res.json({ message: 'Morceau mis à jour', newUrl: finalUrl });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la modification' });
    }
};

// DELETE /api/repetitions/:id
export const deleteRepetition = async (req, res) => {
    const { id } = req.params;

    try {
        const repetition = await Repetition.findById(id);
        if (!repetition) {
            return res.status(404).json({ error: 'Répétition non trouvée' });
        }

        await Repetition.delete(id);
        res.json({ message: 'Morceau supprimé avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
