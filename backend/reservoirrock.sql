-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 15, 2026 at 11:56 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reservoirrock`
--

-- --------------------------------------------------------

--
-- Table structure for table `concerts`
--

CREATE TABLE `concerts` (
  `id` int UNSIGNED NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_concert` date NOT NULL,
  `heure` time DEFAULT NULL,
  `lieu` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `statut` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Entrée libre',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `concerts`
--

INSERT INTO `concerts` (`id`, `titre`, `date_concert`, `heure`, `lieu`, `description`, `image_url`, `statut`, `created_at`, `updated_at`) VALUES
(4, 'LA LONDE LES MAURES', '2026-08-07', '20:00:00', 'AZUREVA', NULL, NULL, 'Entrée libre', '2026-04-03 14:43:10', '2026-04-03 14:43:10'),
(14, 'SANARY SUR MER', '2026-05-09', '14:00:00', 'JUST ROSÉ', NULL, NULL, 'Entrée libre', '2026-04-15 11:54:12', '2026-04-15 11:54:12');

-- --------------------------------------------------------

--
-- Table structure for table `group_settings`
--

CREATE TABLE `group_settings` (
  `key_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `value_text` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group_settings`
--

INSERT INTO `group_settings` (`key_name`, `value_text`) VALUES
('group_announce', 'En préparation : Tribute U2 & MUSE'),
('group_history_1', 'Composé de Jean-Marc, Martial, Romain et Éric, le groupe a forgé son identité sur une obsession : la précision sonore. Ils allient le pur plaisir du jeu à des prestations de qualité professionnelle.'),
('group_history_2', 'Une importance capitale est accordée à la technique et au matériel de pointe, transformant chaque scène en un spectacle soigné et immersif.'),
('group_slogan', 'Plus qu\'un simple groupe de reprises, Réservoir Rock puise son énergie dans un répertoire éclectique et puissant.'),
('group_title_history', 'L\'ÉMOTION PURE, L\'EXIGENCE DU SON'),
('photo_credits', 'MIKA');

-- --------------------------------------------------------

--
-- Table structure for table `guestbook`
--

CREATE TABLE `guestbook` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reponse` text COLLATE utf8mb4_general_ci,
  `is_private` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guestbook`
--

INSERT INTO `guestbook` (`id`, `user_id`, `content`, `created_at`, `reponse`, `is_private`) VALUES
(8, 2, 'J\'adore votre groupe !', '2026-04-08 13:28:24', 'Merci ! Au plaisir de vous rencontrer lors d\'un prochain concert !', 0);

-- --------------------------------------------------------

--
-- Table structure for table `membres`
--

CREATE TABLE `membres` (
  `id` int UNSIGNED NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `instrument` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ordre_affichage` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membres`
--

INSERT INTO `membres` (`id`, `nom`, `instrument`, `photo_url`, `ordre_affichage`) VALUES
(1, 'Éric', 'Batterie', '/images/eric.png', 0),
(2, 'Jean-Marc', 'Chant & Guitare', '/images/JM.png', 0),
(3, 'Romain', 'Guitare', '/images/romain.png', 0),
(4, 'Martial', 'Basse', '/images/martiou.png', 0);

-- --------------------------------------------------------

--
-- Table structure for table `repetitions`
--

CREATE TABLE `repetitions` (
  `id` int UNSIGNED NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `detail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` int UNSIGNED DEFAULT NULL,
  `mime_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `start_time` int DEFAULT '0',
  `end_time` int DEFAULT NULL,
  `status` enum('public','private') COLLATE utf8mb4_general_ci DEFAULT 'private',
  `markers` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `repetitions`
--

INSERT INTO `repetitions` (`id`, `titre`, `detail`, `url`, `file_name`, `file_size`, `mime_type`, `created_at`, `updated_at`, `start_time`, `end_time`, `status`, `markers`) VALUES
(1, 'With Or Without You - U2', 'Répète du 12 février 2026', 'audio/With_or.mp3', NULL, NULL, NULL, '2026-04-07 09:05:34', '2026-04-13 12:56:52', 0, NULL, 'public', NULL),
(4, 'UNDISCLOSED DESIRES - MUSE', 'Répète du 20 janvier 2026', 'audio/Undisclosed_desire.mp3', NULL, NULL, NULL, '2026-04-07 13:30:01', '2026-04-13 12:56:38', 0, NULL, 'public', NULL),
(10, 'locked out of heaven - Bruno Mars', 'répète du 8 avril 2025', 'audio/Locked_out.mp3', NULL, NULL, NULL, '2026-04-08 08:38:52', '2026-04-13 12:56:25', 0, NULL, 'public', NULL),
(11, 'Atomic City - U2', 'répète du 3 avril 2026', 'audio/Atomic_city.mp3', NULL, NULL, NULL, '2026-04-09 11:13:55', '2026-04-13 12:56:15', 0, NULL, 'public', NULL),
(14, 'CAKE BY THE OCEAN - DNCE', 'répète 2025', 'audio/Cake_ocean.mp3', NULL, NULL, NULL, '2026-04-13 11:45:42', '2026-04-14 09:44:06', 0, NULL, 'public', '[]'),
(17, 'new years day', 'morceau à revoir', '/uploads/1776152187946-825842868.mp3', 'New years day.mp3', 6881052, 'audio/mpeg', '2026-04-14 07:36:27', '2026-04-14 09:07:13', 3, 60, 'private', '[{\"time\":15,\"label\":\"voir ici\"},{\"time\":18,\"label\":\"ici\"},{\"time\":30,\"label\":\"ici\"}]'),
(19, 'new years day - U2', 'repete 2026', '/uploads/1776158300289-252935965.mp3', 'New years day.mp3', 6881052, 'audio/mpeg', '2026-04-14 09:18:20', '2026-04-14 09:43:19', 2, 320, 'public', '[]'),
(22, 'Atomic city', '', 'audio/Atomic_city.mp3', NULL, NULL, NULL, '2026-04-14 09:59:31', '2026-04-14 09:59:31', 2, NULL, 'private', '[{\"time\":15,\"label\":\"ici\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int UNSIGNED NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `setting_value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
(1, 'tour_title', 'Tournée 2026', '2026-04-15 10:53:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `firstname` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastname` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','member','user') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Manux', 'Manux', 'manux@gmail.com', '$2b$10$vlCJmQl4LIpm7xugLytHleLymIgj0EkDvUbZJ/gctAtbO53Iyj7h.', 'admin', '2026-04-03 14:30:44'),
(2, 'Patoche', 'Patoche', 'patoche@gmail.com', '$2b$10$7S1MXOYZrcmg2XLDgdfA/.97cvgHjb0om1I5lWBv.lmLYUT2xHUT6', 'user', '2026-04-08 13:27:06'),
(4, 'Eric', 'Eric', 'eric@gmail.com', '$2b$10$PGdbWbi68Oc1n13MjQa.geNKYLkXgikmcjAqcj56Ja7TWvco9Usgy', 'member', '2026-04-14 09:47:34'),
(5, 'Martial', 'Martial', 'martial@gmail.com', '$2b$10$YYv1Xgf1FbJ.zZIngLw1.e/yzMZfXDqAABPoJVqGtGHqKh37QM/x.', 'member', '2026-04-14 09:54:39'),
(6, 'Romain', 'Romain', 'romain@gmail.com', '$2b$10$KP.bm0g6FTOpA5qKmbajaeS8QzSl4FPZskTwnjrASXQFrIZAmgU.6', 'member', '2026-04-14 09:55:11'),
(7, 'JM', 'JM', 'jm@gmail.com', '$2b$10$0xEoUZnqToh3ATer1KTUf.OvJoJFXHBXt3vz6QrGFuouj09F7dNfa', 'admin', '2026-04-14 09:55:54');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int UNSIGNED NOT NULL,
  `titre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url_youtube` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file_size` int UNSIGNED DEFAULT NULL,
  `mime_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `titre`, `url_youtube`, `file_path`, `file_name`, `file_size`, `mime_type`, `description`, `created_at`, `updated_at`) VALUES
(4, 'RéSERVOIR ROCK à BORMES ', 'ac_1MdSA9u0?si=brawqtRe5s_i7Kkj', NULL, NULL, NULL, NULL, 'BORMES LES MIMOSAS', '2026-04-07 13:14:13', '2026-04-10 07:41:56'),
(5, 'RéSERVOIR ROCK au RAYOLET', 'UrrtAPj9Nzw?si=UmM5TPfUqaAht5zo', NULL, NULL, NULL, NULL, 'SIX FOURS', '2026-04-07 13:15:31', '2026-04-10 07:41:47'),
(9, 'Réservoir Rock à la Coudoulière', 'tn8qVJyVRtc', NULL, NULL, NULL, NULL, 'SIX-FOURS', '2026-04-10 08:19:21', '2026-04-10 08:19:21'),
(11, 'réservoir rock à just rosé', 'ljN-FrVUXOI?si=2ThyO9NFpCah6iI9', NULL, NULL, NULL, NULL, 'SANARY SUR MER', '2026-04-15 11:14:13', '2026-04-15 11:20:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `concerts`
--
ALTER TABLE `concerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date` (`date_concert`);

--
-- Indexes for table `group_settings`
--
ALTER TABLE `group_settings`
  ADD PRIMARY KEY (`key_name`);

--
-- Indexes for table `guestbook`
--
ALTER TABLE `guestbook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `membres`
--
ALTER TABLE `membres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `repetitions`
--
ALTER TABLE `repetitions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `concerts`
--
ALTER TABLE `concerts`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `guestbook`
--
ALTER TABLE `guestbook`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `membres`
--
ALTER TABLE `membres`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `repetitions`
--
ALTER TABLE `repetitions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `guestbook`
--
ALTER TABLE `guestbook`
  ADD CONSTRAINT `guestbook_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
