// models/guestbook.model.js
import { query } from '../config/db.js';

const Guestbook = {
    // Récupérer tous les messages publics (pagination)
    async findAllPublic(limit, offset) {
        const countResult = await query('SELECT COUNT(*) as total FROM guestbook WHERE is_private = 0');
        const total = countResult[0].total;

        const sql = `
            SELECT g.*, u.firstname 
            FROM guestbook g 
            LEFT JOIN users u ON g.user_id = u.id 
            WHERE g.is_private = 0 
            ORDER BY g.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const messages = await query(sql, [limit, offset]);

        return { messages, total };
    },

    // Récupérer tous les messages (Admin)
    async findAll() {
        const sql = `
            SELECT g.*, u.firstname, u.email 
            FROM guestbook g 
            LEFT JOIN users u ON g.user_id = u.id 
            ORDER BY g.created_at DESC
        `;
        return await query(sql);
    },

    // Créer un message
    async create(userId, content, isPrivate) {
        const privateValue = isPrivate ? 1 : 0;
        const sql = 'INSERT INTO guestbook (user_id, content, is_private) VALUES (?, ?, ?)';
        return await query(sql, [userId, content, privateValue]);
    },

    // Récupérer un message par ID
    async findById(id) {
        const sql = 'SELECT * FROM guestbook WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Ajouter une réponse à un message
    async addResponse(id, reponse) {
        const sql = "UPDATE guestbook SET reponse = ? WHERE id = ?";
        return await query(sql, [reponse, id]);
    },

    // Supprimer un message
    async delete(id) {
        const sql = 'DELETE FROM guestbook WHERE id = ?';
        return await query(sql, [id]);
    }
};

export default Guestbook;
