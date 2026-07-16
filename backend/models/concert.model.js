// models/concert.model.js
import { query } from '../config/db.js';

const Concert = {
    // Récupérer tous les concerts futurs (pagination)
    async findAllFuture(limit, offset) {
        const sql = 'SELECT * FROM concerts WHERE date_concert >= CURDATE() ORDER BY date_concert ASC LIMIT ? OFFSET ?';
        return await query(sql, [limit, offset]);
    },

    // Compter les concerts futurs
    async countFuture() {
        const result = await query('SELECT COUNT(*) as total FROM concerts WHERE date_concert >= CURDATE()');
        return result[0].total;
    },

    // Créer un concert
    async create(titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url) {
        const sql = 'INSERT INTO concerts (titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        return await query(sql, [titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url]);
    },

    // Récupérer un concert par ID
    async findById(id) {
        const sql = 'SELECT * FROM concerts WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Mettre à jour un concert
    async update(id, titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url) {
        const sql = 'UPDATE concerts SET titre = ?, date_concert = ?, heure = ?, lieu = ?, adresse = ?, telephone = ?, statut = ?, flyer_url = ? WHERE id = ?';
        return await query(sql, [titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url, id]);
    },

    // Supprimer un concert
    async delete(id) {
        const sql = 'DELETE FROM concerts WHERE id = ?';
        return await query(sql, [id]);
    }
};

export default Concert;
