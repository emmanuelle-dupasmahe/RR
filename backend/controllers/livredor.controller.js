// controllers/livredor.controller.js
import Guestbook from '../models/guestbook.model.js';

// GET /api/livredor
export const getAllPublicMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const { messages, total } = await Guestbook.findAllPublic(limit, offset);

        res.json({
            messages,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }
};

// POST /api/livredor
export const createMessage = async (req, res) => {
    const { content, is_private } = req.body;
    const userId = req.user.id;

    // Validations
    if (!content) {
        return res.status(400).json({ error: "Le contenu du message est obligatoire" });
    }

    try {
        await Guestbook.create(userId, content, is_private);
        res.status(201).json({ message: 'Message ajouté avec succès !' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Impossible d\'ajouter le message' });
    }
};

// PUT /api/livredor/:id/reponse
export const addResponse = async (req, res) => {
    const { id } = req.params;
    const { reponse } = req.body;

    // Validations
    if (!reponse) {
        return res.status(400).json({ error: "La réponse est obligatoire" });
    }

    try {
        const message = await Guestbook.findById(id);
        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        await Guestbook.addResponse(id, reponse);
        res.json({ message: "Réponse publiée avec succès !" });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// GET /api/livredor/admin/all
export const getAllMessages = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        const messages = await Guestbook.findAll();
        res.json(messages);
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// DELETE /api/livredor/:id
export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier les permissions
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
        }

        const message = await Guestbook.findById(id);
        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        await Guestbook.delete(id);
        res.json({ message: 'Message supprimé avec succès' });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
