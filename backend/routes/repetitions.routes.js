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

// Routes
router.get('/', getAllRepetitions);
router.post('/', authMiddleware, upload.single('audio'), createRepetition);
router.put('/:id', authMiddleware, upload.single('audio'), updateRepetition);
router.delete('/:id', authMiddleware, deleteRepetition);

export default router;