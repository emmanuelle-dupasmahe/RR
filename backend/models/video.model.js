// models/video.model.js
import { query } from '../config/db.js';

const Video = {
    // Récupérer tous les vidéos (pagination)
    async findAll(limit, offset) {
        const sql = 'SELECT * FROM videos ORDER BY created_at DESC LIMIT ? OFFSET ?';
        return await query(sql, [limit, offset]);
    },

    // Compter les vidéos
    async count() {
        const result = await query('SELECT COUNT(*) as total FROM videos');
        return result[0].total;
    },

    // Créer une vidéo
    async create(titre, description, url_youtube, filePath, fileName, fileSize, mimeType) {
        const sql = `
            INSERT INTO videos (titre, description, url_youtube, file_path, file_name, file_size, mime_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return await query(sql, [titre, description, url_youtube || null, filePath, fileName, fileSize, mimeType]);
    },

    // Récupérer une vidéo par ID
    async findById(id) {
        const sql = 'SELECT * FROM videos WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // Mettre à jour une vidéo
    async update(id, titre, description, url_youtube) {
        const sql = `
            UPDATE videos 
            SET titre = ?, description = ?, url_youtube = ?
            WHERE id = ?
        `;
        return await query(sql, [titre, description, url_youtube, id]);
    },

    // Supprimer une vidéo
    async delete(id) {
        const sql = 'DELETE FROM videos WHERE id = ?';
        return await query(sql, [id]);
    }
};

export default Video;
