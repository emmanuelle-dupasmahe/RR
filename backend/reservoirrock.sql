-- 1. Création de la base de données
CREATE DATABASE IF NOT EXISTS reservoirrock
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


USE reservoirrock;

-- 3. Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
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
    url_youtube VARCHAR(255) NOT NULL, -- Ici on stockera l'ID YouTube
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Table des répétitions
CREATE TABLE IF NOT EXISTS repetitions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    date_repetition DATE NOT NULL,
    heure TIME,
    lieu VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (date_repetition)
) ENGINE=InnoDB;

-- 7. Table des membres du groupe (Optionnel)
CREATE TABLE IF NOT EXISTS membres (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    instrument VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255),
    ordre_affichage INT DEFAULT 0
) ENGINE=InnoDB;