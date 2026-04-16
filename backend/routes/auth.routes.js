// routes/auth.routes.js
import { Router } from 'express';
import { 
    register, 
    login, 
    getProfile, 
    getAllUsers,    // Ajouté
    updateUserRole, // Ajouté
    deleteUser      // Ajouté
} from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/me', authMiddleware, getProfile);

// --- NOUVELLES ROUTES : Gestion des utilisateurs ---
// Récupérer la liste de tous les utilisateurs
router.get('/users', authMiddleware, getAllUsers);

// Modifier le rôle d'un utilisateur (:id est dynamique)
router.put('/users/:id/role', authMiddleware, updateUserRole);

// Supprimer un utilisateur
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;