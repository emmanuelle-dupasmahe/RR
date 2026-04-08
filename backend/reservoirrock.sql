-- 1. Création de la base de données
CREATE DATABASE IF NOT EXISTS reservoirrock
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


USE reservoirrock;

-- 3. Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    role VARCHAR(20) DEFAULT 'user', -- 'user' ou 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Table des concerts
CREATE TABLE IF NOT EXISTS concerts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    date_concert DATE NOT NULL,
    heure TIME,
    lieu VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'Entrée libre', -- Pour gérer vos badges "Entrée libre"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_concert)
) ENGINE=InnoDB;

-- 5. Table des vidéos
CREATE TABLE IF NOT EXISTS videos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    url_youtube VARCHAR(255) NULL, -- Optionnel si on upload en local
    file_path VARCHAR(255) NULL,   -- Chemin du fichier uploadé
    file_name VARCHAR(255) NULL,   -- Nom d'origine du fichier
    file_size INT UNSIGNED NULL,   -- Taille en octets
    mime_type VARCHAR(50) NULL,    -- ex: video/mp4
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Table des répétitions
CREATE TABLE IF NOT EXISTS repetitions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    detail VARCHAR(255),
    url VARCHAR(255) NOT NULL,     -- Chemin d'accès (ex: /uploads/audio.mp3)
    file_name VARCHAR(255) NULL,   -- Nom d'origine
    file_size INT UNSIGNED NULL,   -- Taille en octets
    mime_type VARCHAR(50) NULL,    -- ex: audio/mpeg
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Table des membres du groupe 
CREATE TABLE IF NOT EXISTS membres (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    instrument VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255),
    ordre_affichage INT DEFAULT 0
) ENGINE=InnoDB;

-- 8. Table Livre d'or (Guestbook)
CREATE TABLE IF NOT EXISTS guestbook (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Table de configuration (Settings)
CREATE TABLE IF NOT EXISTS settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO settings (setting_key, setting_value) VALUES ('tour_title', 'Tournée 2026');