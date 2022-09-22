-- Adminer 4.8.1 MySQL 8.0.30 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `when` datetime NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event` (`id`, `description`, `when`, `address`, `name`) VALUES
(1,	'Let\'s meet together.',	'2021-02-15 21:00:00',	'Office St 120',	'Team Meetup'),
(2,	'Let\'s learn something.',	'2021-02-17 21:00:00',	'Workshop St 80',	'Workshop'),
(3,	'Let\'s meet with big bosses.',	'2021-02-17 21:00:00',	'Boss St 100',	'Strategy Meething'),
(4,	'Let\'s try to sell stuff.',	'2021-02-11 21:00:00',	'Money St 34',	'Sales Fitch'),
(5,	'People meet to talk about business ideas.',	'2021-02-12 21:00:00',	'Invention St 123',	'Founders Meeting');

-- 2022-09-22 10:01:02
