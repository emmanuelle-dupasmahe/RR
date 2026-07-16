// routes/membres.routes.js
import express from 'express';
import {
    getAllMembres,
    createMembre,
    updateMembre,
    deleteMembre
} from '../controllers/membres.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// Routes
router.get('/', getAllMembres);
router.post('/', authMiddleware, upload.single('photo'), createMembre);
router.put('/:id', authMiddleware, upload.single('photo'), updateMembre);
router.delete('/:id', authMiddleware, deleteMembre);

export default router;
