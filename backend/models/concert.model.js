import { query } from '../config/db.js';

const Concert = {
    // ── MÉTHODES EXISTANTES  ──
    async findAllFuture(limit, offset) {
        const sql = 'SELECT * FROM concerts WHERE date_concert >= CURDATE() ORDER BY date_concert ASC LIMIT ? OFFSET ?';
        return await query(sql, [limit, offset]);
    },

    async countFuture() {
        const result = await query('SELECT COUNT(*) as total FROM concerts WHERE date_concert >= CURDATE()');
        return result[0].total;
    },

    async create(titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url) {
        const sql = 'INSERT INTO concerts (titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        return await query(sql, [titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url]);
    },

    async findById(id) {
        const sql = 'SELECT * FROM concerts WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    async update(id, titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url) {
        const sql = 'UPDATE concerts SET titre = ?, date_concert = ?, heure = ?, lieu = ?, adresse = ?, telephone = ?, statut = ?, flyer_url = ? WHERE id = ?';
        return await query(sql, [titre, date_concert, heure, lieu, adresse, telephone, statut, flyer_url, id]);
    },

    async delete(id) {
        const sql = 'DELETE FROM concerts WHERE id = ?';
        return await query(sql, [id]);
    },

    // ── NOUVELLES MÉTHODES POUR LA SYNCHRONISATION GOOGLE AGENDA ──

    async findByGoogleId(google_event_id) {
        const sql = 'SELECT * FROM concerts WHERE google_event_id = ?';
        const results = await query(sql, [google_event_id]);
        return results[0] || null;
    },

    async createFromGoogle(google_event_id, titre, date_concert, heure, lieu, adresse) {
        const sql = 'INSERT INTO concerts (google_event_id, titre, date_concert, heure, lieu, adresse, statut) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return await query(sql, [google_event_id, titre, date_concert, heure, lieu, adresse, 'Entrée libre']);
    },

    async updateFromGoogle(google_event_id, titre, date_concert, heure, lieu, adresse) {
        const sql = 'UPDATE concerts SET titre = ?, date_concert = ?, heure = ?, lieu = ?, adresse = ? WHERE google_event_id = ?';
        return await query(sql, [titre, date_concert, heure, lieu, adresse, google_event_id]);
    },

    async deleteByGoogleId(google_event_id) {
        const sql = 'DELETE FROM concerts WHERE google_event_id = ?';
        return await query(sql, [google_event_id]);
    }
};

export default Concert;