-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.7.3-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for messageapp
DROP DATABASE IF EXISTS `messageapp`;
CREATE DATABASE IF NOT EXISTS `messageapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `messageapp`;

-- Dumping structure for table messageapp.friend
DROP TABLE IF EXISTS `friend`;
CREATE TABLE IF NOT EXISTS `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user1` (`user1`),
  KEY `user2` (`user2`),
  CONSTRAINT `user1` FOREIGN KEY (`user1`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user2` FOREIGN KEY (`user2`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table messageapp.friend: ~13 rows (approximately)
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;

-- Dumping structure for table messageapp.message
DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `messageto` int(11) NOT NULL,
  `messagecontent` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`userid`),
  CONSTRAINT `user` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table messageapp.message: ~219 rows (approximately)
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;

-- Dumping structure for table messageapp.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(1024) NOT NULL,
  `onlinestatus` tinyint(4) DEFAULT 2,
  `socketid` varchar(1024) DEFAULT NULL,
  `profilepicture` varchar(1024) DEFAULT 'default.svg',
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table messageapp.user: ~7 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
REPLACE INTO `user` (`id`, `fullname`, `username`, `password`, `onlinestatus`, `socketid`, `profilepicture`, `email`, `phone`) VALUES
	(1, 'Oliver Leander Hansen Stene', 'NUB', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, 'BwZaQ6Cw4UZCZ_7hAAAx', 'default.svg', NULL, NULL),
	(2, 'Arseni Skobelev', 'arsko', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, 'y-MzRIaH2_qsb9B8AAAh', 'default.svg', NULL, NULL),
	(3, 'Johan vikebakk', 'jovik', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, '', 'default.svg', NULL, NULL),
	(4, 'Musie Enbaye', 'menb', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, 'GWm8tzNqevI1nLsIAAHX', 'default.svg', NULL, NULL),
	(5, 'Olav Blomvik', 'oblo', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, '', 'default.svg', NULL, NULL),
	(6, 'Thor Stian Stene', 'tsstene', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, 'f6c7eAdf56EUr1cPAAAB', 'default.svg', 'oliverlhs@outlook.com', '99434236'),
	(7, 'Silje Hovden Hansen', 'siljehoha', '$2b$10$fbuhuSyz8h.PUSxNYucC5.9iIAl0pHU.mkaeyg6T6iF00gfW6CuUO', 2, NULL, 'default.svg', 'silje', '9344325');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
