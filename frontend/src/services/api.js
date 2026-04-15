// services/api.js
const API_URL = 'http://192.168.10.108:5000/api';

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

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
            throw { status: response.status, message: data.error || 'Erreur' };
        }
        return data;
    } catch (error) {
        if (!error.status) {
            throw { status: 0, message: 'Serveur inaccessible' };
        }
        throw error;
    }
}
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

export const concertService = {
    getAll: (page = 1, limit = 10) => fetchAPI(`/concerts?page=${page}&limit=${limit}`),
    create: (data) => fetchAPI('/concerts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/concerts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/concerts/${id}`, { method: 'DELETE' })
};

export const repetitionService = {
    getAll: (page = 1, limit = 10) => fetchAPI(`/repetitions?page=${page}&limit=${limit}`),
    create: (formData) => fetchAPI('/repetitions', { method: 'POST', body: formData }),
    update: (id, formData) => fetchAPI(`/repetitions/${id}`, { method: 'PUT', body: formData }),
    delete: (id) => fetchAPI(`/repetitions/${id}`, { method: 'DELETE' })
};

export const videoService = {
    getAll: (page = 1, limit = 10) => fetchAPI(`/videos?page=${page}&limit=${limit}`),
    create: (formData) => fetchAPI('/videos', { method: 'POST', body: formData }),
    update: (id, data) => fetchAPI(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/videos/${id}`, { method: 'DELETE' })
};

export const memberService = {
    getAll: () => fetchAPI('/membres'),
    create: (data) => fetchAPI('/membres', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetchAPI(`/membres/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetchAPI(`/membres/${id}`, { method: 'DELETE' })
};

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
    })
};

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