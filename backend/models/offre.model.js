// models/offre.model.js
import db from '../config/db.js';

class Offre {
    // Récupérer les offres (avec l'option de ne filtrer que les offres actives pour le site public)
    static async findAll(onlyActive = false) {
        let query = 'SELECT * FROM offres';
        if (onlyActive) {
            query += ' WHERE is_active = 1';
        }
        query += ' ORDER BY id ASC';

        const [rows] = await db.query(query);
        return rows;
    }

    // Trouver une offre spécifique par son ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM offres WHERE id = ?', [id]);
        return rows[0];
    }

    // Créer une nouvelle offre
    static async create(titre, description, prix, image_url, is_active = 1) {
        const [result] = await db.query(
            'INSERT INTO offres (titre, description, prix, image_url, is_active) VALUES (?, ?, ?, ?, ?)',
            [titre, description, prix, image_url, is_active]
        );
        return result.insertId;
    }

    // Mettre à jour une offre existante
    static async update(id, titre, description, prix, image_url, is_active) {
        const [result] = await db.query(
            'UPDATE offres SET titre = ?, description = ?, prix = ?, image_url = ?, is_active = ? WHERE id = ?',
            [titre, description, prix, image_url, is_active, id]
        );
        return result.affectedRows > 0;
    }

    // Supprimer une offre
    static async delete(id) {
        const [result] = await db.query('DELETE FROM offres WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default Offre;