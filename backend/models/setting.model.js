// models/setting.model.js
import { query } from '../config/db.js';

const Setting = {
    // Récupérer une valeur par clé
    async findByKey(key) {
        const sql = 'SELECT setting_value FROM settings WHERE setting_key = ?';
        const results = await query(sql, [key]);
        return results[0] || null;
    },

    // Mettre à jour une valeur
    async update(key, value) {
        const sql = 'UPDATE settings SET setting_value = ? WHERE setting_key = ?';
        return await query(sql, [value, key]);
    }
};

export default Setting;
