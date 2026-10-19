// models/groupSetting.model.js
import { query } from '../config/db.js';

const GroupSetting = {
    // Récupérer tous les paramètres du groupe
    async findAll() {
        const results = await query('SELECT * FROM group_settings');

        // Transformer en objet { key: value }
        const settings = {};
        results.forEach(row => {
            settings[row.key_name] = row.value_text;
        });

        return settings;
    },

    // Récupérer un paramètre par clé
    async findByKey(key) {
        const sql = 'SELECT * FROM group_settings WHERE key_name = ?';
        const results = await query(sql, [key]);
        return results[0] || null;
    },

    // Mettre à jour un paramètre
    async update(key_name, value_text) {
        const sql = "UPDATE group_settings SET value_text = ? WHERE key_name = ?";
        return await query(sql, [value_text, key_name]);
    },

    // Insérer ou mettre à jour (UPSERT)
    async upsert(key_name, value_text) {
        const sql = `
            INSERT INTO group_settings (key_name, value_text) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE value_text = ?
        `;
        return await query(sql, [key_name, value_text, value_text]);
    }
};

export default GroupSetting;
