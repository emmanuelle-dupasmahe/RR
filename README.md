# 🎸 Réservoir Rock - Site Officiel

Plateforme web dynamique pour le groupe **Réservoir Rock** (Six-Fours-les-Plages). Ce site permet aux fans de suivre l'actualité du groupe, de consulter les dates de concerts, d'écouter des répétitions, de visionner des vidéos et d'interagir via un livre d'or. Il inclut également un tableau de bord administratif complet pour la gestion du contenu.

## 🚀 Technologies utilisées

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling moderne et responsive)
- **React Router Dom** (Navigation)
- **Framer Motion** (Animations - optionnel)

### Backend
- **Node.js** & **Express**
- **MySQL** (Base de données relationnelle)
- **JSON Web Tokens (JWT)** (Authentification sécurisée)
- **Multer** (Gestion de l'upload de fichiers audio/vidéo)
- **Dotenv** (Variables d'environnement)

## ✨ Fonctionnalités

### Pour les utilisateurs
- **Accueil** : Affichage dynamique du prochain concert et visuels (Hero) mis à jour par l'admin.
- **Le Groupe** : Présentation des musiciens, histoire du groupe et répertoire.
- **Concerts** : Liste chronologique des prochaines dates de tournée.
- **Vidéos** : Galerie de vidéos (Intégrations YouTube ou fichiers locaux).
- **Studio Répétitions** : Lecteur audio pour écouter les derniers enregistrements du groupe.
- **Livre d'or** : Espace de discussion pour les fans (authentification requise pour poster).
- **Espace Membre (Backstage)** : Accès exclusif aux enregistrements privés (WIP) pour les utilisateurs ayant le rôle "Membre".

### Pour les administrateurs (BackStage)
- **Gestion des Concerts** : CRUD complet (Ajouter, Modifier, Supprimer).
- **Gestion des Musiciens** : Mise à jour des membres et de leurs photos.
- **Gestion Média** : Upload et gestion des morceaux audio (avec système de **Markers**/horodatage) et des vidéos.
- **Modération** : Suppression de messages sur le livre d'or et système de réponse officielle.
- **Gestion des Utilisateurs** : Contrôle des accès, promotion des comptes au rang de "Membre" et suppression d'utilisateurs.
- **Design & Contenu** : Mise à jour dynamique des images Hero (Desktop/Mobile), du slogan, de l'histoire du groupe et du répertoire.

## 🛠️ Installation et Configuration

### Prérequis
- [Node.js](https://nodejs.org/)
- [Laragon](https://laragon.org/) ou un serveur MySQL local

### 1. Cloner le projet
```bash
git clone https://github.com/votre-utilisateur/reservoir-rock.git
cd reservoir-rock
```

### 2. Configuration du Backend
1. Allez dans le dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` à la racine du dossier `backend` :
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=votre_bdd
JWT_SECRET=votre_cle_secrete
JWT_EXPIRES_IN=7d
```
4. Importez le schéma SQL fourni dans votre base de données MySQL.
5. Démarrez le serveur : `npm start` (ou `node server.js`)

### 3. Configuration du Frontend
1. Allez dans le dossier frontend : `cd ../frontend`
2. Installez les dépendances : `npm install`
3. Démarrez le projet : `npm run dev`

## 📁 Structure du Projet

```text
RR/
├── backend/
│   ├── config/          # Configuration DB
│   ├── middlewares/     # Auth, Upload
│   ├── routes/          # API Endpoints (concerts, guestbook, etc.)
│   ├── uploads/         # Stockage des fichiers médias
│   └── server.js        # Point d'entrée Express
├── frontend/
│   ├── src/
│   │   ├── components/  # Header, Footer, PrivateRoute
│   │   ├── hooks/       # useAuth
│   │   └── pages/       # Dashboard, Livredor, etc.
│   └── tailwind.config.js
└── README.md
```

## 📸 Crédits
- **Photographies** : Mika
- **Musique** : Réservoir Rock
---
© 2026 Réservoir Rock - Tous droits réservés.