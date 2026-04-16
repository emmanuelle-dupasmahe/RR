// controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
// Génère un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};
// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }
        const user = await User.create({ email, password, firstname, lastname, role: 'user' });
        const token = generateToken(user);
        res.status(201).json({ message: 'Inscription réussie', user, token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
        console.log(error);
    }
};
// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user || !(await User.verifyPassword(password, user.password))) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }
        const token = generateToken(user);
        res.json({
            user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// GET /api/auth/me
export const getProfile = async (req, res) => {
    res.json({ user: req.user });
};

//ajout pour gérer le role des users
// GET /api/auth/users
export const getAllUsers = async (req, res) => {
    try {
        // On récupère tous les utilisateurs via le modèle
        // Note : Assure-toi d'avoir une méthode findAll() dans ton user.model.js
        const users = await User.findAll(); 
        
        // On renvoie les infos sauf le mot de passe pour la sécurité
        const safeUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            firstname: u.firstname,
            lastname: u.lastname,
            role: u.role
        }));
        
        res.json(safeUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
};

// PUT /api/auth/users/:id/role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // 1. On récupère l'utilisateur cible
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        // 2. Sécurité : Interdiction de modifier un admin
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Action interdite sur un administrateur' });
        }

        // 3. Mise à jour (Assure-toi d'avoir une méthode updateRole dans ton modèle)
        await User.updateRole(id, role);
        
        res.json({ message: `Utilisateur passé au rang : ${role}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
    }
};

// DELETE /api/auth/users/:id
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        // Sécurité : Interdiction de supprimer un admin
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Impossible de supprimer un compte administrateur' });
        }

        await User.delete(id);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};