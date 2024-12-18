-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: dessysattic
-- ------------------------------------------------------
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

--
-- Table structure for table `admin_email`
--

/*!40101 SET character_set_client = @saved_cs_client */;

-- Table structure for table `admin_email`
DROP TABLE IF EXISTS `admin_email`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_email` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `admin_email`

LOCK TABLES `admin_email` WRITE;
/*!40000 ALTER TABLE `admin_email` DISABLE KEYS */;
INSERT INTO `admin_email` (`email`, `created_at`) VALUES
('dessysattic@gmail.com', '2024-11-22 17:23:43'),
('Omoefeeweka6@gmail.com', '2024-11-22 17:23:43');
/*!40000 ALTER TABLE `admin_email` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `collection_products`


--
-- Table structure for table `collection_products`
--

/*!40101 SET character_set_client = @saved_cs_client */;

-- Table structure for table `collection_products`
DROP TABLE IF EXISTS `collection_products`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collection_products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `productId` int unsigned NOT NULL,
  `collectionId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `collectionId` (`collectionId`),
  KEY `collection_products_ibfk_1` (`productId`),
  CONSTRAINT `collection_products_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `collection_products_ibfk_2` FOREIGN KEY (`collectionId`) REFERENCES `collections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `collection_products`

LOCK TABLES `collection_products` WRITE;
/*!40000 ALTER TABLE `collection_products` DISABLE KEYS */;
INSERT INTO `collection_products` (`name`, `description`, `createdAt`, `updatedAt`, `productId`, `collectionId`) VALUES
('Prota', 'Wear Your Confidence', '2024-11-19 07:13:19', '2024-11-19 07:26:29', 1, 1),
('Prota', 'Wear Your Confidence', '2024-11-19 07:13:19', '2024-11-19 07:26:29', 5, 1),
('New', 'Checkout our latest arrivals', '2024-11-19 07:13:19', '2024-11-20 02:11:59', 3, 2),
('New', 'Checkout our latest arrivals', '2024-11-19 07:13:19', '2024-11-20 02:11:59', 4, 2),
('BestSellers', 'Discover Our Latest Arrivals! ? You won?t want to miss out on our newest collections?', '2024-11-19 07:13:19', '2024-11-19 14:13:40', 2, 3),
('BestSellers', 'Discover Our Latest Arrivals! ? You won?t want to miss out on our newest collections?', '2024-11-19 07:13:19', '2024-11-19 14:13:40', 6, 3);
/*!40000 ALTER TABLE `collection_products` ENABLE KEYS */;
UNLOCK TABLES;

-- Table structure for table `collections`
DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collections` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- Dumping data for table `collections`

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` (`title`, `description`, `image`, `createdAt`, `updatedAt`) VALUES
('Próta', 'Wear Your Confidence', 'https://res.cloudinary.com/dsonuae0l/image/upload/v1726881470/jpmmnjtlpcrwcf9xvt8h.jpg', '2024-09-21 02:18:00', '2024-09-21 02:18:00'),
('New Arrival', 'Checkout our latest arrivals', 'https://res.cloudinary.com/dsonuae0l/image/upload/v1726881554/nmxtec8mnfpprw9z02xp.jpg', '2024-09-21 02:19:21', '2024-09-21 02:19:21'),
('Best Sellers', 'Discover Our Latest Arrivals! You won’t want to miss out on our newest collection. Explore now and find your next favourite piece!', 'https://res.cloudinary.com/dsonuae0l/image/upload/v1727477951/b5kjuzlcqqgeowlp7dr2.jpg', '2024-09-27 23:59:20', '2024-09-27 23:59:20');
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `userId_2` (`userId`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletters`
--

DROP TABLE IF EXISTS `newsletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletters` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime DEFAULT NULL,
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletters`
--

LOCK TABLES `newsletters` WRITE;
/*!40000 ALTER TABLE `newsletters` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `_id` int unsigned NOT NULL AUTO_INCREMENT,
  `products` json NOT NULL,
  `shippingAddress` json NOT NULL,
  `shippingRate` decimal(10,2) DEFAULT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `customerId` int unsigned NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `orders_ibfk_1` (`customerId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `media` json DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `expense` decimal(10,2) DEFAULT '0.00',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `collection_id` int unsigned DEFAULT NULL,
  `collections` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_collection_id` (`collection_id`),
  CONSTRAINT `fk_collection_id` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Bubu Mila','* Free size bubu dress\nÔÇó cotton brocade adire print\nÔÇó turtleneck with buttons behind\nÔÇó elastic arm bands to adjust','[\"https://res.cloudinary.com/dsonuae0l/image/upload/v1726881946/gjy5rnwvx1ibrpoqig6z.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1726881961/rdzhspmwtpoo9nd21hqs.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1726881982/xsbwsedua40mkr6zdpfy.png\"]','Gown and Pants','[\"Top\"]','[\"small\", \"medium\", \"large\"]','[\"Flowery\"]',40.00,4.10,'2024-09-21 02:29:45','2024-09-21 02:29:45',1,'[\"New Arrivals\", \"Pr├│ta\", \"Best Sellers\"]'),(2,'CELIA Pants','Elegant pants perfect for special occasions.','[\"https://res.cloudinary.com/dsonuae0l/image/upload/v1726885057/ycwrjlgj4jg7wcm0ojxu.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1726885135/kjlhjsscmlew8kfog8od.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1726885135/giewpqmdfebdspaxsy8b.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1726885135/fpkh4mqerq53pcdmdsma.jpg\"]','Pants','[\"top\"]','[\"small\", \"medium\", \"large\"]','[]',30.00,18.10,'2024-09-21 03:21:23','2024-09-21 03:21:23',3,'[\"New Arrivals\", \"Pr├│ta\", \"Best Sellers\"]'),(3,'Izzy Jumpsuit','ÔÇócotton fabric\nÔÇóbaggy fit\nÔÇóside pockets \nÔÇóbutton detail in front\nÔÇóflare bottom','[\"https://res.cloudinary.com/dsonuae0l/image/upload/v1727049907/evsug4xe5rnoymbkekhc.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727049978/cil6mubhbrnpgyqsaeo0.jpg\"]','Jumpsuit','[\"Top\"]','[\"Small\", \"Medium\", \"Large\"]','[\"Orange\"]',45.00,3.00,'2024-09-23 01:10:56','2024-09-23 01:10:56',2,'[\"collection1\", \"collection2\"]'),(4,'Celia Pants','ÔÇó100% cotton fabric \nÔÇóadire patterned\nÔÇótwo colored details\nÔÇóbaggy fit (length can be adjusted)\nÔÇósize down for a more fitted look\nÔÇóunisex \nÔÇóelastic waist band','[\"https://res.cloudinary.com/dsonuae0l/image/upload/v1727050407/p6t7ugbajypjrloltxoa.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727050423/mo1qmox8owsiu1c4js1z.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727050444/s2wm7bqfkhqmle9ct2td.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727050467/njxl8zlvgpp043kbuo4j.jpg\"]','Pants','[\"Elegance\", \"Top\"]','[\"Small\", \"Medium\", \"Large\"]','[]',30.00,3.00,'2024-09-23 01:16:57','2024-09-23 01:16:57',2,'[\"collection1\", \"collection2\"]'),(5,'Celia Two Piece','ÔÇócotton brocade fabric \nÔÇóbaggy fit (length: can be adjusted to suit)\nÔÇósize down for a more fitted look\nÔÇóelastic waist band','[\"https://res.cloudinary.com/dsonuae0l/image/upload/v1727345822/thixbvjjf8gytjcv1qxh.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727345830/zcap86qx9rc7cm0aurjr.jpg\"]','Two Piece','[\"Top\"]','[\"small\", \"Medium\", \"Large\"]','[\"blue\", \"Yellow\"]',34.00,0.10,'2024-09-26 11:19:17','2024-09-26 11:19:17',1,'[\"collection1\", \"collection2\"]'),(6,'DSY Print Pant','ÔÇócotton brocade fabric \nÔÇóadire patterned\nÔÇóDSY print\nÔÇóbaggy fit (length: can be adjusted to suit)\nÔÇósize down for a more fitted look\nÔÇóunisex \nÔÇóelastic waist band','[\"https://res.cloudinary.com/dsonuae0l/image/upload/v1727478382/nuy3rsyzo5jdnwmntebo.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727478407/enuiwoygznwcconevcgh.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727478441/s3f6bdd6hm7brroh5c8p.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727478462/kd1b5dkidwthji9qgleo.jpg\", \"https://res.cloudinary.com/dsonuae0l/image/upload/v1727478488/pekjcheii37koqi3zoy4.jpg\"]','Pants','[\"Top\", \"Best\"]','[\"Small\", \"Medium\", \"Large\", \"Xlarge\"]','[]',33.00,0.10,'2024-09-28 00:08:17','2024-09-28 00:08:17',3,'[\"collection1\", \"collection2\"]');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
ALTER DATABASE `dessysattic` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_products_insert` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
    DECLARE collection_title VARCHAR(255);
    
    -- Get the title of the collection based on collection_id
    SELECT title INTO collection_title
    FROM collections
    WHERE id = NEW.collection_id;

    -- Assign the collection title to the NEW.collections field
    SET NEW.collections = collection_title;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `dessysattic` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci,
  `content` json NOT NULL,
  `rating` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email_product` (`email`,`productId`),
  UNIQUE KEY `unique_review_email_productId` (`email`,`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'Gp Godspo','{\"text\": \"It was a wonderful seamless shopping experience\"}',5,'gmukoro3@gmail.com','2024-10-11 19:48:12','2024-10-11 19:48:12',1),(2,'Gp Godspo','{\"text\": \"Thank you for the superb customer service, I will definitely stop by again\"}',5,'gmukoro3@gmail.com','2024-10-11 20:41:38','2024-10-11 20:41:38',2),(3,'Gp Godspo','{\"text\": \"I also got this jumpsuit for my wife, she loved it so much. Thank you so much.\"}',4,'gmukoro3@gmail.com','2024-10-11 20:45:05','2024-10-11 20:45:05',3),(4,'Payne Paulo','{\"text\": \"It was a very wonderful and easy experience. Thank you so much\"}',5,'paynemelissa002@gmail.com','2024-11-21 01:36:34','2024-11-21 01:36:34',4),(5,'Payne Paulo','{\"text\": \"It was a very wonderful and easy experience. Thank you so much\"}',5,'abuhnaomi9@gmail.com','2024-11-21 02:54:12','2024-11-21 02:54:12',5),(6,'John Doe','{\"text\": \"Great product, highly recommend!\"}',5,'johndoe@example.com','2024-11-24 04:07:15','2024-11-24 04:07:15',1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` json DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `wishlist` json NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Dessy','gmukoro3@gmail.com','$2a$10$yWBHL2/7lAm0pK0B1mpfFuLn8JuyWwn7vWbd3FGoaZQKhwqaG0MJm',NULL,0,'[]','user','2024-10-24 15:12:28','2024-11-24 19:22:40'),(2,'Dessyril Omoefe','dessysattic@gmail.com','$2a$10$nTFrLa7P2CmkyLsA0T4xSeFkTo/YS4VVrlpcv4kPs7IpzmFhgk5KC',NULL,1,'[6, 2, 4]','admin','2024-10-24 16:46:36','2024-11-25 06:39:48'),(3,'Agnes Ogbaji Uduma','abuhnaomi9@gmail.com','$2a$10$RYP2OMNQC5n8ShRcS6iHguRzPjzwvmI5FlfkY3XOvn90W3CUV6L26',NULL,0,'[{\"productId\": \"[4, 7, 5]\"}, {\"productId\": \"[6, 1, 5, 4, 2, 7, 3]\"}]','user','2024-10-27 10:29:38','2024-11-24 20:00:21'),(4,'Godspower Mukoro','gpmukoro@gmail.com','$2a$10$8yO.Cal4PsK7s/0ItcP4V.UD84ZT.4smJ0AvSEAI75nC2bZSrUa5S',NULL,0,'[]','user','2024-11-18 22:31:14','2024-11-24 19:19:18'),(5,'Payne Paulo','paynemelissa002@gmail.com','$2a$10$tBYZaeH6NnppMBC2fs/jpuflysDJan67OipZcPXXCp1u1.3bFkG0.',NULL,0,'[]','user','2024-11-18 23:02:01','2024-11-24 19:19:18'),(6,'David Ovie Edema','geepeemmanuel@gmail.com','$2a$10$4jH5mV2YNnziPVNdhYsl4O/FZ45BciPYRkFBLL1Ea3eVz8gMj0YDC',NULL,0,'[]','user','2024-11-18 23:08:42','2024-11-24 19:19:18'),(7,'Dessyril Omo','jentledon@gmail.com','$2a$10$z1LEsBtChOl8.Q1OQObDRe4Fp2ul6pxCuXQMi4EeTa0joqiQTbyvy',NULL,0,'[]','user','2024-11-18 23:16:59','2024-11-24 19:19:18'),(8,'Payne Paulo','kantorglenn53@gmail.com','$2a$10$32SZXmk6O8FT3.TdTorKqeiIPJ93PKGWDSoZtDsAsunHZdYWVzo7S',NULL,0,'[]','user','2024-11-18 23:33:32','2024-11-24 19:19:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_tokens` (
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_tokens`
--

LOCK TABLES `verification_tokens` WRITE;
/*!40000 ALTER TABLE `verification_tokens` DISABLE KEYS */;
INSERT INTO `verification_tokens` VALUES ('$2a$10$HONNJabuJ1WXcOJXhVg4gO03otLbFI7qHl/F/IHh.jn21QY.udMZG','4','2024-11-19 22:31:16'),('$2a$10$3gs1jM5PBSnsUhvwhYcfQ.51b4R/xFuBCrqsaZfVw3DwXZfLHrDAO','5','2024-11-19 23:02:01'),('$2a$10$/3l7EfpPL2cWGYNq8CPRNOauL5vQdq1vrrkhSBqAAbidOUYfhMAh2','6','2024-11-19 23:08:42'),('$2a$10$cDX8qkxAWTo0aQ3sd2gsJ.tBzsDPvOYfj6cyrr941nMKCMraSdfFe','7','2024-11-19 23:17:00'),('$2a$10$xRR9oQvD.8OzkOcwNT9oku6eak/QXqPXa7wogrcNSjPN4Wq39wTLq','8','2024-11-19 23:33:32');
/*!40000 ALTER TABLE `verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26 11:50:24
