// models/repetition.model.js
import { query } from '../config/db.js';

const Repetition = {
    // Récupérer tous les morceaux avec filtrage par rôle
    async findByRole(userRole, limit, offset) {
        let sql, countSql;
        let params = [limit, offset];

        if (userRole === 'admin' || userRole === 'member') {
            countSql = 'SELECT COUNT(*) as total FROM repetitions';
            sql = 'SELECT * FROM repetitions ORDER BY id DESC LIMIT ? OFFSET ?';
        } else {
            countSql = 'SELECT COUNT(*) as total FROM repetitions WHERE status = "public"';
            sql = 'SELECT * FROM repetitions WHERE status = "public" ORDER BY id DESC LIMIT ? OFFSET ?';
        }

        const countResult = await query(countSql);
        const total = countResult[0].total;
        const repetitions = await query(sql, params);

        return { repetitions, total };
    },

    // Créer une répétition
    async create(titre, detail, url, fileName, fileSize, mimeType, start_time, end_time, status, markers) {
        const sql = `
            INSERT INTO repetitions 
            (titre, detail, url, file_name, file_size, mime_type, start_time, end_time, status, markers) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await query(sql, [
            titre,
            detail,
            url,
            fileName,
            fileSize,
            mimeType,
            start_time || 0,
            end_time || null,
            status || 'private',
            markers || null
        ]);
    },

    // Récupérer une répétition par ID
    async findById(id) {
        const sql = 'SELECT * FROM repetitions WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Mettre à jour une répétition
    async update(id, titre, detail, url, start_time, end_time, status, markers) {
        const sql = `
            UPDATE repetitions 
            SET titre = ?, detail = ?, url = ?, start_time = ?, end_time = ?, status = ?, markers = ?
            WHERE id = ?
        `;
        return await query(sql, [titre, detail, url, start_time, end_time, status, markers, id]);
    },

    // Supprimer une répétition
    async delete(id) {
        const sql = 'DELETE FROM repetitions WHERE id = ?';
        return await query(sql, [id]);
    }
};

export default Repetition;
