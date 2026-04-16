// services/api.js

/**
 * CONFIGURATION DE L'ADRESSE IP
 * Modifie uniquement BASE_URL si ton adresse IP change (ex: passage de .108 à .110)
 */
export const BASE_URL = 'http://192.168.10.110:5000';
const API_URL = `${BASE_URL}/api`;

/**
 * Fonction générique pour centraliser les appels fetch
 */
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };

    // Injection du token si l'utilisateur est connecté
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Gestion automatique du JSON pour le body (sauf si c'est un FormData pour l'upload)
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw { status: response.status, message: data.error || 'Erreur lors de la requête' };
        }
        return data;
    } catch (error) {
        // Gestion des erreurs réseau (serveur éteint ou mauvaise IP)
        if (!error.status) {
            throw { status: 0, message: 'Le serveur est inaccessible (Vérifiez l\'IP ou si le serveur Node tourne).' };
        }
        throw error;
    }
}

// --- SERVICES D'AUTHENTIFICATION ---
export const authService = {
    register: (userData) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    login: (email, password) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    getProfile: () => fetchAPI('/auth/me')
};

// --- SERVICES DES CONCERTS ---
export const concertService = {
    getAll: (page = 1, limit = 10) => fetchAPI(`/concerts?page=${page}&limit=${limit}`),
    create: (data) => fetchAPI('/concerts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/concerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/concerts/${id}`, { method: 'DELETE' })
};

// --- SERVICES DU STUDIO / RÉPÉTITIONS ---
export const repetitionService = {
    getAll: (page = 1, limit = 50) => fetchAPI(`/repetitions?page=${page}&limit=${limit}`),
    create: (formData) => fetchAPI('/repetitions', { method: 'POST', body: formData }),
    update: (id, formData) => fetchAPI(`/repetitions/${id}`, { method: 'PUT', body: formData }),
    delete: (id) => fetchAPI(`/repetitions/${id}`, { method: 'DELETE' })
};

// --- SERVICES VIDÉOS ---
export const videoService = {
    getAll: (page = 1, limit = 10) => fetchAPI(`/videos?page=${page}&limit=${limit}`),
    create: (formData) => fetchAPI('/videos', { method: 'POST', body: formData }),
    update: (id, data) => fetchAPI(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/videos/${id}`, { method: 'DELETE' })
};

// --- SERVICES MEMBRES ---
export const memberService = {
    getAll: () => fetchAPI('/membres'),
    create: (data) => fetchAPI('/membres', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/membres/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/membres/${id}`, { method: 'DELETE' })
};

// --- SERVICES RÉGLAGES (Dashboard) ---
export const settingsService = {
    getTourTitle: () => fetchAPI('/settings/tour_title'),
    updateTourTitle: (value) => fetchAPI('/settings/tour_title', { 
        method: 'POST', 
        body: JSON.stringify({ value }) 
    }),
    getGroupSettings: () => fetchAPI('/groupesettings'),
    updateGroupSetting: (key, value) => fetchAPI('/groupesettings', { 
        method: 'POST', 
        body: JSON.stringify({ key_name: key, value_text: value }) 
    }),
    // AJOUT DE LA FONCTION POUR LES PHOTOS HERO
    updateHeroImage: (key, formData) => fetchAPI(`/groupesettings/hero/${key}`, { 
        method: 'POST', 
        body: formData 
    })
};

// --- SERVICES LIVRE D'OR ---
export const guestbookService = {
    getPublic: (page = 1, limit = 5) => fetchAPI(`/guestbook?page=${page}&limit=${limit}`),
    getAdminAll: () => fetchAPI('/guestbook/admin/all'),
    postMessage: (content, is_private) => fetchAPI('/guestbook', { 
        method: 'POST', 
        body: JSON.stringify({ content, is_private }) 
    }),
    updateResponse: (id, reponse) => fetchAPI(`/guestbook/${id}/reponse`, { 
        method: 'PUT', 
        body: JSON.stringify({ reponse }) 
    }),
    deleteMessage: (id) => fetchAPI(`/guestbook/${id}`, { method: 'DELETE' })
};

// --- SERVICES UTILISATEURS (Administration) ---
export const userService = {
    getAll: () => fetchAPI('/auth/users'),
    updateRole: (id, role) => fetchAPI(`/auth/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    }),
    delete: (id) => fetchAPI(`/auth/users/${id}`, { 
        method: 'DELETE' 
    })
};