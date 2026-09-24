// models/photo.model.js
import db from '../config/db.js'; // Ajuste ce chemin selon l'emplacement de ta connexion MySQL

class Photo {
    // Récupérer toutes les photos, triées par l'ordre choisi puis par date d'ajout
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM galerie_photos ORDER BY ordre ASC, created_at DESC');
        return rows;
    }

    // Ajouter une nouvelle photo
    static async create(url_photo, description, ordre = 0) {
        const [result] = await db.query(
            'INSERT INTO galerie_photos (url_photo, description, ordre) VALUES (?, ?, ?)',
            [url_photo, description, ordre]
        );
        return result.insertId;
    }

    // Supprimer une photo
    static async delete(id) {
        const [result] = await db.query('DELETE FROM galerie_photos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default Photo;