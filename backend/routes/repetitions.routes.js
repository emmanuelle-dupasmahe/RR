// routes/repetitions.routes.js
import express from 'express';
import {
    getAllRepetitions,
    createRepetition,
    updateRepetition,
    deleteRepetition
} from '../controllers/repetitions.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Fonction pour intercepter proprement les erreurs de sécurité Multer
const handleUpload = (req, res, next) => {
    const uploadAudio = upload.single('audio');

    uploadAudio(req, res, function (err) {
        if (err) {
            // Si le fileFilter rejette le fichier, on renvoie un JSON propre (Erreur 400)
            return res.status(400).json({ error: err.message });
        }
        // Si tout va bien, on passe au contrôleur suivant
        next();
    });
};

// Routes 
router.get('/', getAllRepetitions);
router.post('/', authMiddleware, handleUpload, createRepetition);
router.put('/:id', authMiddleware, handleUpload, updateRepetition);
router.delete('/:id', authMiddleware, deleteRepetition);

export default router;