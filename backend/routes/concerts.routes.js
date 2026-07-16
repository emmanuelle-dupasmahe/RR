// routes/concerts.routes.js
import express from 'express';
import {
    getAllConcerts,
    createConcert,
    updateConcert,
    deleteConcert
} from '../controllers/concerts.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Routes
router.get('/', getAllConcerts);
router.post('/', authMiddleware, upload.single('flyer'), createConcert);
router.put('/:id', authMiddleware, upload.single('flyer'), updateConcert);
router.delete('/:id', authMiddleware, deleteConcert);

export default router;
