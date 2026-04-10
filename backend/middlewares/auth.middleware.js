// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant' });
        }
        const token = authHeader.split(' ')[1];

        // Vérification sommaire de la structure (doit avoir 2 points pour 3 parties)
        if (!token || token.split('.').length !== 3 || token === 'undefined' || token === 'null') {
            return res.status(401).json({ error: 'Format de token invalide (malformed)' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }
        if (req.method !== 'GET' && user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès refusé : Droits administrateur requis' });
        }
        req.user = user;
        next();//pour ne pas tourner en boucle
    } catch (error) {
        console.error("Erreur JWT Middleware:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        return res.status(401).json({ error: 'Token invalide' });
    }
};
export default authMiddleware;