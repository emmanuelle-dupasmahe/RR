// models/membre.model.js
import { query } from '../config/db.js';

const Membre = {
    // Récupérer tous les membres
    async findAll() {
        const q = "SELECT * FROM membres ORDER BY ordre_affichage ASC";
        return await query(q);
    },

    // Créer un membre
    async create(nom, instrument, photo_url, ordre_affichage) {
        const q = "INSERT INTO membres (nom, instrument, photo_url, ordre_affichage) VALUES (?, ?, ?, ?)";
        return await query(q, [nom, instrument, photo_url, ordre_affichage || 0]);
    },

    // Récupérer un membre par ID
    async findById(id) {
        const q = "SELECT * FROM membres WHERE id = ?";
        const results = await query(q, [id]);
        return results[0] || null;
    },

    // Mettre à jour un membre
    async update(id, nom, instrument, photo_url, ordre_affichage) {
        const q = `
            UPDATE membres 
            SET nom = ?, instrument = ?, photo_url = ?, ordre_affichage = ? 
            WHERE id = ?
        `;
        return await query(q, [nom, instrument, photo_url, ordre_affichage, id]);
    },

    // Supprimer un membre
    async delete(id) {
        const q = "DELETE FROM membres WHERE id = ?";
        return await query(q, [id]);
    }
};

export default Membre;
