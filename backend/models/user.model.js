// models/user.model.js
import { query } from '../config/db.js';
import bcrypt from 'bcrypt';

const User = {
    // Trouver par email
    async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const results = await query(sql, [email.toLowerCase()]);
        return results[0] || null;
    },

    // Trouver par ID (sans le password)
    async findById(id) {
        const sql = 'SELECT id, email, firstname, lastname, role, created_at FROM users WHERE id = ?';
        const results = await query(sql, [id]);
        return results[0] || null;
    },

    // --- NOUVEAU : Récupérer tous les utilisateurs (pour l'admin) ---
    async findAll() {
        const sql = 'SELECT id, email, firstname, lastname, role, created_at FROM users ORDER BY created_at DESC';
        return await query(sql);
    },

    // Créer un utilisateur
    async create({ email, password, firstname, lastname }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO users (email, password, firstname, lastname, role)
            VALUES (?, ?, ?, ?, 'user')
        `;
        const result = await query(sql, [
            email.toLowerCase(),
            hashedPassword,
            firstname,
            lastname
        ]);
        return { id: result.insertId, email, firstname, lastname, role: 'user' };
    },

    // --- NOUVEAU : Modifier le rôle d'un utilisateur ---
    async updateRole(id, role) {
        const sql = 'UPDATE users SET role = ? WHERE id = ?';
        return await query(sql, [role, id]);
    },

    // --- NOUVEAU : Supprimer un utilisateur ---
    async delete(id) {
        const sql = 'DELETE FROM users WHERE id = ?';
        return await query(sql, [id]);
    },

    // Vérifier le mot de passe
    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};

export default User;