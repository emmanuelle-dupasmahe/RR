import multer from 'multer';
import path from 'path';
import fs from 'fs';

// On s'assure que le dossier uploads existe
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre de sécurité strict côté serveur
const fileFilter = (req, file, cb) => {
    // Liste des extensions autorisées (images, audio, vidéo)
    const allowedFileTypes = /jpeg|jpg|png|webp|mp3|mp4|wav|m4a/;

    // Vérification de l'extension du nom de fichier
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    // Vérification du type MIME (la véritable signature du fichier)
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Le fichier est sûr et accepté
    } else {
        // Rejet immédiat si le format n'est pas dans la liste
        cb(new Error("Erreur de sécurité : Type de fichier non autorisé."));
    }
};

// Intégration du filtre à l'export de Multer
export const upload = multer({
    storage,
    fileFilter
});