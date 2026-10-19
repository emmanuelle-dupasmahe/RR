// Le chemin du frontend et l'adresse du backend peuvent être différents.
export const BACKEND_BASE_URL = (
    import.meta.env.VITE_API_URL || import.meta.env.BASE_URL
).replace(/\/+$/, '');

export function publicAssetUrl(path) {
    return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function mediaUrl(path) {
    if (!path || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
    return `${BACKEND_BASE_URL}/${path.replace(/^\/+/, '')}`;
}
