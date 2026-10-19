// controllers/livredor.controller.js
import Guestbook from '../models/guestbook.model.js';
import nodemailer from 'nodemailer';

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
        // 1. Sauvegarde du message en base de données
        await Guestbook.create(userId, content, is_private);

        // 2. Configuration de Nodemailer (Le "facteur")
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. Préparation de l'email
        const mailOptions = {
            from: `"Site Réservoir Rock" <${process.env.EMAIL_USER}>`, // Expéditeur
            to: process.env.EMAIL_DEST, // Destinataire (le batteur)
            subject: '🎸 Nouveau message de contact - Réservoir Rock',
            text: `Nouveau message de ${req.user.firstname} ${req.user.lastname} (${req.user.email}) :\n\n"${content}"`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #e3181f; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Nouveau Message</h2>
                    </div>
                    <div style="padding: 20px; background-color: #fafafa;">
                        <p><strong>De :</strong> ${req.user.firstname} ${req.user.lastname}</p>
                        <p><strong>Email :</strong> <a href="mailto:${req.user.email}" style="color: #e3181f;">${req.user.email}</a></p>
                        <p><strong>Type :</strong> <span style="background-color: #333; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${is_private ? 'Message Privé' : 'Livre d\'or (Public)'}</span></p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="font-size: 16px; white-space: pre-wrap; line-height: 1.5;">${content}</p>
                    </div>
                </div>
            `
        };

        // 4. Envoi de l'email (en arrière-plan pour ne pas bloquer la réponse au visiteur)
        transporter.sendMail(mailOptions).catch(err => {
            console.error("Erreur lors de l'envoi de l'email via Nodemailer :", err);
        });

        // 5. Réponse de succès au front-end
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
        // on vérifie que l'utilisateur est admin
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