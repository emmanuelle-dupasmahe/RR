-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : lun. 13 juil. 2026 à 08:04
-- Version du serveur : 10.11.14-MariaDB-0+deb12u2
-- Version de PHP : 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `reservoirrock`
--

-- --------------------------------------------------------

--
-- Structure de la table `concerts`
--

CREATE TABLE `concerts` (
  `id` int(10) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `date_concert` date NOT NULL,
  `heure` time DEFAULT NULL,
  `lieu` varchar(255) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `statut` varchar(50) DEFAULT 'Entrée libre',
  `flyer_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `concerts`
--

INSERT INTO `concerts` (`id`, `titre`, `date_concert`, `heure`, `lieu`, `adresse`, `telephone`, `description`, `image_url`, `statut`, `flyer_url`, `created_at`, `updated_at`) VALUES
(4, 'LA LONDE LES MAURES', '2026-08-07', '20:00:00', 'AZUREVA', '423 Route du Pèllegrin 83250 La Londe-les-Maures', '04 94 05 14 14', NULL, NULL, 'Entrée libre', '/uploads/1781607748795-623642696.png', '2026-04-03 14:43:10', '2026-06-16 11:02:28'),
(14, 'SANARY SUR MER', '2026-05-09', '14:00:00', 'JUST ROSÉ', 'Allées  Estienne d’Orves  83110 Sanary sur Mer', '06 28 29 48 14', NULL, NULL, 'Entrée libre', '/uploads/1777459036676-53393163.png', '2026-04-15 11:54:12', '2026-04-29 10:37:16'),
(18, 'SIX-FOURS LES PLAGES', '2026-08-01', '18:00:00', 'RESTAURANT PISCINE DOMAINE COUDOULIÈRE', '180 avenue du Lac Six-Fours les Plages', '04 98 18 25 94', NULL, NULL, 'Entrée libre', '/uploads/1781607423183-644966415.png', '2026-04-24 08:01:06', '2026-06-16 10:57:03'),
(19, 'SANARY SUR MER', '2026-06-21', '21:00:00', 'FÊTE DE LA MUSIQUE', 'Kiosque à musique', '', NULL, NULL, 'Entrée libre', '/uploads/1781602162457-563809921.jpg', '2026-04-24 13:08:26', '2026-06-16 09:29:22'),
(20, 'CONCERT ANNULÉ ', '2026-07-09', '21:00:00', 'Concert annulé ', 'Domaine de la Brûlade, 1263 Av. du Général de Gaulle, La Londe-les-Maures', '04 94 58 62 07', NULL, NULL, 'Entrée libre', '/uploads/1781603308426-322371679.png', '2026-04-24 18:01:05', '2026-07-08 17:15:16'),
(21, 'LA LONDE LES MAURES', '2026-08-06', '21:00:00', 'RESTAURANT L’ALEZAN', 'Domaine de la Brûlade, 1263 Av. du Général de Gaulle, La Londe-les-Maures', '04 94 58 62 07', NULL, NULL, 'Entrée libre', '/uploads/1781603689067-991221299.png', '2026-04-24 18:03:12', '2026-06-16 09:54:49');

-- --------------------------------------------------------

--
-- Structure de la table `group_settings`
--

CREATE TABLE `group_settings` (
  `key_name` varchar(50) NOT NULL,
  `value_text` text DEFAULT NULL,
  `group_repertoire` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `group_settings`
--

INSERT INTO `group_settings` (`key_name`, `value_text`, `group_repertoire`) VALUES
('group_announce', 'En préparation : Tribute U2 & MUSE', NULL),
('group_history_1', 'Composé de Jean-Marc, Martial, Romain et Éric, le groupe a forgé son identité sur une obsession : la précision sonore. Ils allient le pur plaisir du jeu à des prestations de qualité professionnelle.', NULL),
('group_history_2', 'Une importance capitale est accordée à la technique et au matériel de pointe, transformant chaque scène en un spectacle soigné et immersif.', NULL),
('group_repertoire', 'U2 • Muse • Téléphone • The Police • Genesis • Les Rita Mitsouko • Eminem • Axel Bauer • Bruno Mars • Harry Styles • Santana • BB Brunes • Queen • The Supermen Lovers • AC/DC • Kaleo • Trust • DNCE • Lenny Kravitz • Zucchero • Bob Marley • -M- • Rare Earth • Junkie XL • Nickelback • The Killers • Rage Against ThE Machine...', NULL),
('group_slogan', 'Plus qu\'un simple groupe de reprises, Réservoir Rock puise son énergie dans un répertoire éclectique et puissant.', NULL),
('group_title_history', 'L\'ÉMOTION PURE, L\'EXIGENCE DU SON', NULL),
('hero_desktop', '/uploads/1780925539607-555564308.jpg', NULL),
('hero_mobile', '/uploads/1776450316392-884177107.jpg', NULL),
('photo_credits', 'MIKA', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `guestbook`
--

CREATE TABLE `guestbook` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `reponse` text DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `guestbook`
--

INSERT INTO `guestbook` (`id`, `user_id`, `content`, `created_at`, `reponse`, `is_private`) VALUES
(29, 7, 'N\'importe quoi', '2026-04-18 16:04:02', NULL, 1),
(31, 11, 'Une belle voix ! J\'adore ❤️', '2026-04-18 16:40:58', NULL, 0),
(32, 14, 'Super groupe qui fait danser tout le monde à chaque représentation !\nSuper sympas en plus.\nJe serai là au prochain concert, restez comme vous êtes ! ', '2026-05-17 13:59:51', NULL, 0),
(33, 15, 'Bravo au groupe réservoir rock pour leur professionnalisme. Ce groupe touche toutes les générations. Merci à eux pour les émotions qu\'ils transmettent et le bonheur partagé. ', '2026-06-13 02:11:40', NULL, 0),
(34, 8, 'Un groupe génial , bravo ', '2026-07-09 08:32:24', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `membres`
--

CREATE TABLE `membres` (
  `id` int(10) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `instrument` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `ordre_affichage` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `membres`
--

INSERT INTO `membres` (`id`, `nom`, `instrument`, `photo_url`, `ordre_affichage`) VALUES
(1, 'Éric', 'Batterie', '/images/eric.png', 0),
(2, 'Jean-Marc', 'Chant & guitare', '/images/JM.png', 0),
(3, 'Romain', 'Guitare', '/images/romain.png', 0),
(4, 'Martial', 'Basse', '/images/martiou.png', 0);

-- --------------------------------------------------------

--
-- Structure de la table `repetitions`
--

CREATE TABLE `repetitions` (
  `id` int(10) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(10) UNSIGNED DEFAULT NULL,
  `mime_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_time` int(11) DEFAULT 0,
  `end_time` int(11) DEFAULT NULL,
  `status` enum('public','private') DEFAULT 'private',
  `markers` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `repetitions`
--

INSERT INTO `repetitions` (`id`, `titre`, `detail`, `url`, `file_name`, `file_size`, `mime_type`, `created_at`, `updated_at`, `start_time`, `end_time`, `status`, `markers`) VALUES
(49, 'ATOMIC CITY', 'Répétition du 22/05/26', '/uploads/1779564028620-43013588.mp3', 'Atomic city.mp3', 3862772, 'audio/mpeg', '2026-05-23 19:20:28', '2026-05-23 19:20:28', 0, NULL, 'private', '[]'),
(50, 'WITH OR WITHOUT YOU', 'Répétition du 22/05/26', '/uploads/1779564773682-44906315.mp3', 'With or without you.mp3', 5962921, 'audio/mpeg', '2026-05-23 19:32:53', '2026-05-23 19:32:53', 0, NULL, 'private', '[]'),
(51, 'STILL HAVEN\'T FOUND', 'Répétition du 22/05/26', '/uploads/1779565211707-541796994.mp3', 'Still havent found.mp3', 4703769, 'audio/mpeg', '2026-05-23 19:40:11', '2026-05-23 19:40:11', 0, NULL, 'private', '[]'),
(52, 'HOLD ME', 'Répétition du 22/05/26', '/uploads/1779565591640-68794240.mp3', 'Hold me.mp3', 2156874, 'audio/mpeg', '2026-05-23 19:46:31', '2026-05-23 19:46:31', 0, NULL, 'private', '[]'),
(53, 'MAGNIFICENT', 'Répétition du 22/05/26', '/uploads/1779566660078-96660400.mp3', 'Magnificent.mp3', 6309433, 'audio/mpeg', '2026-05-23 20:04:20', '2026-05-28 11:37:37', 0, NULL, 'private', '[]'),
(54, 'MYSTERIOUS WAY', 'Répétition du 22/05/26', '/uploads/1779567796194-757353802.mp3', 'Mysterious way.mp3', 4570982, 'audio/mpeg', '2026-05-23 20:23:16', '2026-06-05 12:09:31', 0, NULL, 'private', '[]'),
(55, 'SUPREMACY', 'Répétition du 22/05/26', '/uploads/1779568539425-310222057.mp3', 'Supremacy.mp3', 5014863, 'audio/mpeg', '2026-05-23 20:35:39', '2026-05-23 20:35:39', 0, NULL, 'private', '[]'),
(56, 'THE WILL OF PEOPLE', 'Répétition du 22/05/26', '/uploads/1779569108624-650958043.mp3', 'The will of people.mp3', 3514244, 'audio/mpeg', '2026-05-23 20:45:08', '2026-05-23 20:45:08', 0, NULL, 'private', '[]'),
(58, 'LOCKED OUT OF HEAVEN - BRUNO MARS', 'Répète 2025', '/uploads/1779588844817-539175936.mp3', 'Locked out of heaven.mp3', 5678294, 'audio/mpeg', '2026-05-24 02:14:04', '2026-05-24 02:14:04', 0, 230, 'public', '[]'),
(59, 'CAKE BY THE OCEAN - DNCE', 'Répète 2025', '/uploads/1779589261445-944263046.mp3', 'Cake by the ocean 2.mp3', 5134785, 'audio/mpeg', '2026-05-24 02:21:01', '2026-05-24 02:21:21', 0, NULL, 'public', '[]'),
(60, 'JE DIS M - M', 'Répète 2025', '/uploads/1779589888113-612934168.mp3', 'Je dis M.mp3', 5667176, 'audio/mpeg', '2026-05-24 02:31:28', '2026-05-24 02:31:28', 0, NULL, 'public', '[]'),
(61, 'NEW YEARS DAY - U2', 'Répète 2026', '/uploads/1779591721303-733527077.mp3', 'New years day.mp3', 6881052, 'audio/mpeg', '2026-05-24 03:02:01', '2026-05-24 05:15:49', 0, 252, 'public', '[]'),
(63, 'MAGNIFICENT - U2', 'Répète 2026', '/uploads/1779594021085-344464465.mp3', 'Magnificent.mp3', 6052954, 'audio/mpeg', '2026-05-24 03:40:21', '2026-05-24 03:40:21', 3, 317, 'public', '[]');

-- --------------------------------------------------------

--
-- Structure de la table `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
(1, 'tour_title', 'Tournée 2026', '2026-06-22 18:08:23');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `role`, `created_at`) VALUES
(4, 'Eric', 'Eric', 'eric@gmail.com', '$2b$10$PGdbWbi68Oc1n13MjQa.geNKYLkXgikmcjAqcj56Ja7TWvco9Usgy', 'member', '2026-04-14 09:47:34'),
(5, 'Martial', 'Martial', 'martial@gmail.com', '$2b$10$YYv1Xgf1FbJ.zZIngLw1.e/yzMZfXDqAABPoJVqGtGHqKh37QM/x.', 'member', '2026-04-14 09:54:39'),
(6, 'Romain', 'Romain', 'romain@gmail.com', '$2b$10$KP.bm0g6FTOpA5qKmbajaeS8QzSl4FPZskTwnjrASXQFrIZAmgU.6', 'member', '2026-04-14 09:55:11'),
(7, 'JM', 'JM', 'jm@gmail.com', '$2b$10$0xEoUZnqToh3ATer1KTUf.OvJoJFXHBXt3vz6QrGFuouj09F7dNfa', 'admin', '2026-04-14 09:55:54'),
(8, 'Manux', 'Manux', 'manux@gmail.com', '$2b$10$/sxtq1Tt2n.Th/dJkPR/9Oxc3q8rJw/bR.FpN4VyC.CyOQrXF4tCe', 'admin', '2026-04-17 07:15:46'),
(11, 'Val', 'Lopes ', 'valerielopes@hotmail.fr', '$2b$10$kuxdaaFVYRlZSLGAQrWoDeT807JGNM7nWlflXl1MRwPpJ0O.3YufK', 'member', '2026-04-18 16:39:52'),
(13, 'Fabienne', 'Fa', 'fa@gmail.com', '$2b$10$vr0q6o/68V64TBIYAWNzS.5FE.hNRSyiy1RUh9q4gxNNiiBDQTk8W', 'member', '2026-05-16 17:09:33'),
(14, 'Valentine', 'LESCURE', 'valentinelsc@live.fr', '$2b$10$FBXcbuy4/ckc2ZvcqGjFD.2w6bkAtc38uGIzrE0WsDcOnCkSRhjNC', 'user', '2026-05-17 13:58:49'),
(15, 'Nathalie', 'Lescure', 'lescure.nathalie888@gmail.com', '$2b$10$7vlDY2YCiBRQQSuPaFlxhudyZSR5fnqNzqO4Z.UR1RUNxQq16dk86', 'user', '2026-05-17 16:32:20'),
(16, 'Thierry', 'BEULQUE', 'thierry.beulque@laposte.net', '$2b$10$woJuRVti2voMp5Qm7iWZmO7SSVp.Ao47wytOrTDoQNa/BWnjIi7KS', 'user', '2026-06-15 07:33:58');

-- --------------------------------------------------------

--
-- Structure de la table `videos`
--

CREATE TABLE `videos` (
  `id` int(10) UNSIGNED NOT NULL,
  `titre` varchar(255) NOT NULL,
  `url_youtube` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(10) UNSIGNED DEFAULT NULL,
  `mime_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `videos`
--

INSERT INTO `videos` (`id`, `titre`, `url_youtube`, `file_path`, `file_name`, `file_size`, `mime_type`, `description`, `created_at`, `updated_at`) VALUES
(9, 'Réservoir Rock à la Coudoulière', 'tn8qVJyVRtc', NULL, NULL, NULL, NULL, 'SIX-FOURS 2025', '2026-04-10 08:19:21', '2026-04-17 12:35:43'),
(16, 'Réservoir rock à Just Rosé ', 'yJ4d5yHL8hI', NULL, NULL, NULL, NULL, 'SANARY SUR MER 2026', '2026-05-22 12:51:05', '2026-05-22 12:51:05'),
(27, 'RESERVOIR ROCK AU KIOSQUE 21 JUIN 2026', 'GFNx0z40EYg', NULL, NULL, NULL, NULL, 'SANARY SUR MER SUR LE KIOSQUE ', '2026-07-08 12:37:53', '2026-07-08 12:37:53'),
(28, 'RÉSERVOIR ROCK AU BRÛLAT', '1IHlg5MyrO4', NULL, NULL, NULL, NULL, 'LE BRÛLAT 21 JUIN 2025', '2026-07-09 08:18:38', '2026-07-11 17:06:22');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `concerts`
--
ALTER TABLE `concerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`date_concert`);

--
-- Index pour la table `group_settings`
--
ALTER TABLE `group_settings`
  ADD PRIMARY KEY (`key_name`);

--
-- Index pour la table `guestbook`
--
ALTER TABLE `guestbook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `membres`
--
ALTER TABLE `membres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `repetitions`
--
ALTER TABLE `repetitions`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `concerts`
--
ALTER TABLE `concerts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `guestbook`
--
ALTER TABLE `guestbook`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `membres`
--
ALTER TABLE `membres`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `repetitions`
--
ALTER TABLE `repetitions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT pour la table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `guestbook`
--
ALTER TABLE `guestbook`
  ADD CONSTRAINT `guestbook_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
