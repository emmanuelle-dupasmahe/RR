// routes/livredor.routes.js
import express from 'express';
import {
    getAllPublicMessages,
    createMessage,
    addResponse,
    getAllMessages,
    deleteMessage
} from '../controllers/livredor.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes spécifiques d'abord (avant les routes avec :id)
router.get('/admin/all', authMiddleware, getAllMessages);

// Puis les routes génériques
router.get('/', getAllPublicMessages);
router.post('/', authMiddleware, createMessage);
router.put('/:id/reponse', addResponse);
router.delete('/:id', authMiddleware, deleteMessage);

export default router;