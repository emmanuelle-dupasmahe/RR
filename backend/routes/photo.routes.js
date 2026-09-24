// routes/photo.routes.js
import express from 'express';
import { getAllPhotos, createPhoto, deletePhoto } from '../controllers/photo.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Route publique : tout le monde peut voir les photos du carrousel
router.get('/', getAllPhotos);

// Routes protégées : seul le groupe (depuis le dashboard) peut ajouter/supprimer
// Le nom 'image' dans upload.single('image') doit correspondre au champ de ton futur formulaire React
router.post('/', authMiddleware, upload.single('image'), createPhoto);
router.delete('/:id', authMiddleware, deletePhoto);

export default router;