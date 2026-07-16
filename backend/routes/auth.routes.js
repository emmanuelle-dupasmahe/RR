// routes/auth.routes.js
import { Router } from 'express';
import {
    register,
    login,
    getProfile,
    getAllUsers,
    updateUserRole,
    deleteUser
} from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);
router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:id/role', authMiddleware, updateUserRole);
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;