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

// Fonction interception erreurs de sécurité Multer
const handleUpload = (req, res, next) => {
    const uploadAudio = upload.single('audio');

    uploadAudio(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// Routes 
router.get('/', getAllRepetitions);
router.post('/', authMiddleware, handleUpload, createRepetition);
router.put('/:id', authMiddleware, handleUpload, updateRepetition);
router.delete('/:id', authMiddleware, deleteRepetition);

export default router;