// routes/offre.routes.js
import express from 'express';
import { getAllOffres, createOffre, updateOffre, deleteOffre } from '../controllers/offre.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Route publique : voir les offres
router.get('/', getAllOffres);

// Routes protégées : gestion des offres depuis le dashboard
router.post('/', authMiddleware, upload.single('image'), createOffre);
router.put('/:id', authMiddleware, upload.single('image'), updateOffre);
router.delete('/:id', authMiddleware, deleteOffre);

export default router;