-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
-- Host: localhost    Database: dessysattic
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Table structure for table `users`

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` JSON DEFAULT NULL,
  `verified` TINYINT(1) NOT NULL DEFAULT '0',
  `wishlist` JSON NOT NULL,
  `role` ENUM('admin', 'user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` VALUES
(1,'Dessy','gmukoro3@gmail.com','$2a$10$yWBHL2/7lAm0pK0B1mpfFuLn8JuyWwn7vWbd3FGoaZQKhwqaG0MJm',NULL,0,'[]','user','2024-10-24 15:12:28','2024-11-24 19:22:40'),
(2,'Dessyril Omoefe','dessysattic@gmail.com','$2a$10$nTFrLa7P2CmkyLsA0T4xSeFkTo/YS4VVrlpcv4kPs7IpzmFhgk5KC',NULL,1,'[6, 2, 4]','admin','2024-10-24 16:46:36','2024-11-25 06:39:48'),
(3,'Agnes Ogbaji Uduma','abuhnaomi9@gmail.com','$2a$10$RYP2OMNQC5n8ShRcS6iHguRzPjzwvmI5FlfkY3XOvn90W3CUV6L26',NULL,0,'[{"productId": [4, 7, 5]}, {"productId": [6, 1, 5, 4, 2, 7, 3]}]','user','2024-10-27 10:29:38','2024-11-24 20:00:21'),
(4,'Godspower Mukoro','gpmukoro@gmail.com','$2a$10$8yO.Cal4PsK7s/0ItcP4V.UD84ZT.4smJ0AvSEAI75nC2bZSrUa5S',NULL,0,'[]','user','2024-11-18 22:31:14','2024-11-24 19:19:18'),
(5,'Payne Paulo','paynemelissa002@gmail.com','$2a$10$tBYZaeH6NnppMBC2fs/jpuflysDJan67OipZcPXXCp1u1.3bFkG0.','[]',0,'[]','user','2024-11-18 23:02:01','2024-11-24 19:19:18'),
(6,'David Ovie Edema','geepeemmanuel@gmail.com','$2a$10$4jH5mV2YNnziPVNdhYsl4O/FZ45BciPYRkFBLL1Ea3eVz8gMj0YDC',NULL,0,'[]','user','2024-11-18 23:08:42','2024-11-24 19:19:18'),
(7,'Dessyril Omo','jentledon@gmail.com','$2a$10$z1LEsBtChOl8.Q1OQObDRe4Fp2ul6pxCuXQMi4EeTa0joqiQTbyvy',NULL,0,'[]','user','2024-11-18 23:16:59','2024-11-24 19:19:18'),
(8,'Payne Paulo','kantorglenn53@gmail.com','$2a$10$32SZXmk6O8FT3.TdTorKqeiIPJ93PKGWDSoZtDsAsunHZdYWVzo7S',NULL,0,'[]','user','2024-11-18 23:33:32','2024-11-24 19:19:18');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;

UNLOCK TABLES;

-- Reset session variables
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET SQL_NOTES=@OLD_SQL_NOTES */;
