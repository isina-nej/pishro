-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: pishro
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

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
-- Table structure for table `AboutPage`
--

DROP TABLE IF EXISTS `AboutPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AboutPage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDescription` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaKeywords` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AboutPage`
--

LOCK TABLES `AboutPage` WRITE;
/*!40000 ALTER TABLE `AboutPage` DISABLE KEYS */;
INSERT INTO `AboutPage` VALUES ('9u81dxnzv','{\"title\":\"درباره پیشرو\",\"description\":\"مؤسسه‌ای متخصص در آموزش و مشاوره سرمایه‌گذاری\"}',1,'2026-04-25 22:13:21','2026-04-25 22:13:21','درباره ما | پیشرو','آشنایی با تیم، تاریخچه و ماموریت مؤسسه سرمایه‌ گذاری پیشرو',NULL);
/*!40000 ALTER TABLE `AboutPage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BusinessConsulting`
--

DROP TABLE IF EXISTS `BusinessConsulting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BusinessConsulting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDescription` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaKeywords` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BusinessConsulting`
--

LOCK TABLES `BusinessConsulting` WRITE;
/*!40000 ALTER TABLE `BusinessConsulting` DISABLE KEYS */;
INSERT INTO `BusinessConsulting` VALUES ('ni91cwyz6','{\"title\":\"خدمات مشاوره کسب و کار\",\"description\":\"تخصصی‌ترین خدمات مشاوره برای توسعه کسب و کار شما\"}',1,'2026-04-25 22:13:21','2026-04-26 17:42:53','مشاوره کسب و کار | پیشرو','دریافت مشاوره تخصصی کسب و کار و راه‌اندازی استارتاپ از کارشناسان مجرب پیشرو',NULL);
/*!40000 ALTER TABLE `BusinessConsulting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published` tinyint(1) DEFAULT '1',
  `order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES ('6a2f831b-40cf-11f1-9c13-2c3b70e54e3f','cryptocurrency','ارزهای دیجیتال','آموزش جامع ارزهای دیجیتال و بلاک‌چین',NULL,'2026-04-25 21:21:40','2026-04-25 21:21:40',1,0),('6a321d4f-40cf-11f1-9c13-2c3b70e54e3f','airdrop','ایردراپ','یادگیری روش‌های کسب توکن‌های رایگان',NULL,'2026-04-25 21:21:40','2026-04-25 21:21:40',1,0),('6a3293bb-40cf-11f1-9c13-2c3b70e54e3f','nft','NFT','آموزش NFT و دنیای هنر دیجیتال',NULL,'2026-04-25 21:21:40','2026-04-25 21:21:40',1,0),('6a32f054-40cf-11f1-9c13-2c3b70e54e3f','metaverse','متاورس','سفری به دنیای متاورس و امکانات آن',NULL,'2026-04-25 21:21:40','2026-04-25 21:21:40',1,0),('6a337cbf-40cf-11f1-9c13-2c3b70e54e3f','stock','بورس','آموزش کامل معاملات و تحلیل بورس',NULL,'2026-04-25 21:21:40','2026-04-25 21:21:40',1,0);
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Certificate`
--

DROP TABLE IF EXISTS `Certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Certificate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aboutPageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Certificate`
--

LOCK TABLES `Certificate` WRITE;
/*!40000 ALTER TABLE `Certificate` DISABLE KEYS */;
INSERT INTO `Certificate` VALUES ('h6q741glo','عضو انجمن کارگزاران','عضویت فعال در انجمن ملی',NULL,'9u81dxnzv',1,2,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('kei7my76m','معتبر از بانک مرکزی','مجوز فعالیت در حوزه سرمایه‌گذاری',NULL,'9u81dxnzv',1,1,'2026-04-25 22:13:22','2026-04-25 22:13:22');
/*!40000 ALTER TABLE `Certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` double DEFAULT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `Comment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Comment_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `img` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `discountPercent` int DEFAULT NULL,
  `time` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `students` int DEFAULT NULL,
  `videosCount` int DEFAULT NULL,
  `introVideoUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoryId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'FA',
  `instructor` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `published` tinyint(1) DEFAULT '1',
  `featured` tinyint(1) DEFAULT '0',
  `views` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `Course_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES ('1777579423321_r5cim8yd0','نقشه‌برداری NFT و هنر دیجیتال',349000,'/images/nft/chart.png',NULL,'آموزش ایجاد و فروش NFT‌های دیجیتالی',5,'14:00:00',420,40,NULL,'6a3293bb-40cf-11f1-9c13-2c3b70e54e3f','nft-advanced','INTERMEDIATE','FA','علی کریمی','ACTIVE',1,0,0,'2026-04-30 23:33:43','2026-04-30 23:33:43'),('e26c0953-44ac-11f1-82a2-2c3b70e54e3f','آموزش کامل بورس برای مبتدیان',299000,'/images/stock/stock-landing.jpg',4.5,'دوره جامع برای یادگیری بورس از صفر تا صد',20,'12 ساعت',1250,45,NULL,'6a337cbf-40cf-11f1-9c13-2c3b70e54e3f','stock-beginner','BEGINNER','FA','علی محمدی','ACTIVE',1,0,0,'2026-04-30 19:24:34','2026-05-01 01:02:34'),('e26c09ba-44ac-11f1-82a2-2c3b70e54e3f','ارزهای دیجیتال و بلاک‌چین پیشرفته',399000,'/images/crypto/landing-img.png',4.7,'دوره پیشرفته برای سرمایه‌گذاران حرفه‌ای',15,'20 ساعت',850,60,NULL,'6a2f831b-40cf-11f1-9c13-2c3b70e54e3f','crypto-advanced','ADVANCED','FA','فرزاد احمدی','ACTIVE',1,0,0,'2026-04-30 19:24:34','2026-05-01 01:02:34'),('e26c09c8-44ac-11f1-82a2-2c3b70e54e3f','تحلیل تکنیکال بورس',349000,'/images/stock/stock-landing.jpg',4.6,'آموزش تحلیل تکنیکال و الگوهای قیمتی',10,'16 ساعت',980,52,NULL,'6a337cbf-40cf-11f1-9c13-2c3b70e54e3f','technical-analysis','INTERMEDIATE','FA','مریم رضایی','ACTIVE',1,0,0,'2026-04-30 19:24:34','2026-05-01 01:02:34'),('e26c09d1-44ac-11f1-82a2-2c3b70e54e3f','NFT و توکن‌های دیجیتال',279000,'/images/nft/nft.png',4.4,'دوره کامل درباره NFT و هنر دیجیتال',25,'10 ساعت',650,35,NULL,'6a3293bb-40cf-11f1-9c13-2c3b70e54e3f','nft-tokens','BEGINNER','FA','سارا کریمی','ACTIVE',1,0,0,'2026-04-30 19:24:34','2026-05-01 01:02:34'),('e26c09d9-44ac-11f1-82a2-2c3b70e54e3f','ایردراپ و کسب توکن رایگان',199000,'/images/stock/stock-landing.jpg',4.3,'روش‌های محافظت‌شده برای کسب توکن‌های رایگان',30,'8 ساعت',2100,28,NULL,'6a321d4f-40cf-11f1-9c13-2c3b70e54e3f','airdrop-guide','BEGINNER','FA','حسن پور','ACTIVE',1,0,0,'2026-04-30 19:24:34','2026-05-01 01:02:34');
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseComment`
--

DROP TABLE IF EXISTS `CourseComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseComment` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `CourseComment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CourseComment_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseComment`
--

LOCK TABLES `CourseComment` WRITE;
/*!40000 ALTER TABLE `CourseComment` DISABLE KEYS */;
/*!40000 ALTER TABLE `CourseComment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseLike`
--

DROP TABLE IF EXISTS `CourseLike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseLike` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('LIKE','DISLIKE') COLLATE utf8mb4_unicode_ci DEFAULT 'LIKE',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_courseId` (`userId`,`courseId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `CourseLike_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CourseLike_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseLike`
--

LOCK TABLES `CourseLike` WRITE;
/*!40000 ALTER TABLE `CourseLike` DISABLE KEYS */;
INSERT INTO `CourseLike` VALUES ('9b999055-0b2f-4e11-aa23-666cf60039be','test-user-1','e26c09ba-44ac-11f1-82a2-2c3b70e54e3f','DISLIKE','2026-05-14 09:04:17','2026-05-14 09:04:22'),('a69d3bbc-dcaa-47e8-a393-f77787feb4a9','test-user-1','1777579423321_r5cim8yd0','LIKE','2026-05-02 04:10:10','2026-05-02 04:10:11'),('b2f51853-0707-4549-8666-dc34606a298b','test-user-1','e26c0953-44ac-11f1-82a2-2c3b70e54e3f','LIKE','2026-05-02 02:32:21','2026-05-02 02:32:21');
/*!40000 ALTER TABLE `CourseLike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseSave`
--

DROP TABLE IF EXISTS `CourseSave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseSave` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_courseId` (`userId`,`courseId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `CourseSave_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `CourseSave_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseSave`
--

LOCK TABLES `CourseSave` WRITE;
/*!40000 ALTER TABLE `CourseSave` DISABLE KEYS */;
INSERT INTO `CourseSave` VALUES ('53561b35-c489-4bfb-81ab-0564a4ad2f96','test-user-1','e26c0953-44ac-11f1-82a2-2c3b70e54e3f','2026-05-02 02:33:08'),('c3b3114d-c2f2-4a47-9092-cea11e1e04e6','test-user-1','1777579423321_r5cim8yd0','2026-05-02 04:10:14');
/*!40000 ALTER TABLE `CourseSave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DigitalBook`
--

DROP TABLE IF EXISTS `DigitalBook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DigitalBook` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publisher` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int NOT NULL,
  `pages` int DEFAULT NULL,
  `isbn` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'فارسی',
  `rating` double DEFAULT '0',
  `votes` int DEFAULT '0',
  `views` int DEFAULT '0',
  `downloads` int DEFAULT '0',
  `category` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formats` json DEFAULT NULL,
  `status` json DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `readingTime` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isFeatured` tinyint(1) DEFAULT '0',
  `price` int DEFAULT NULL,
  `fileUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audioUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagIds` json DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DigitalBook`
--

LOCK TABLES `DigitalBook` WRITE;
/*!40000 ALTER TABLE `DigitalBook` DISABLE KEYS */;
INSERT INTO `DigitalBook` VALUES ('63805540-459c-11f1-b7a4-2c3b70e54e3f','راهنمای سرمایه‌ گذاری هوشمند','smart-investment-guide','احمد رضایی','کتاب جامع درباره سرمایه‌ گذاری و مدیریت سرمایه',NULL,'انتشارات پیشرو',2023,250,NULL,'فارسی',0,0,0,0,'سرمایه‌ گذاری',NULL,NULL,NULL,NULL,1,99000,NULL,NULL,NULL,'2026-05-01 23:59:01','2026-05-01 23:59:01'),('63805863-459c-11f1-b7a4-2c3b70e54e3f','بورس برای مبتدیان','stock-market-beginners','علی محمدی','مقدمه‌ای ساده به دنیای بورس',NULL,'انتشارات آموزش',2023,180,NULL,'فارسی',0,0,0,0,'بورس',NULL,NULL,NULL,NULL,1,79000,NULL,NULL,NULL,'2026-05-01 23:59:01','2026-05-01 23:59:01'),('638059c1-459c-11f1-b7a4-2c3b70e54e3f','بلاک‌چین و ارزهای دیجیتال','blockchain-crypto','فرزاد احمدی','شناخت کامل فناوری بلاک‌چین و ارزهای دیجیتال',NULL,'انتشارات تکنولوژی',2023,320,NULL,'فارسی',0,0,0,0,'ارزهای دیجیتال',NULL,NULL,NULL,NULL,0,149000,NULL,NULL,NULL,'2026-05-01 23:59:01','2026-05-01 23:59:01');
/*!40000 ALTER TABLE `DigitalBook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Enrollment`
--

DROP TABLE IF EXISTS `Enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Enrollment` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` double DEFAULT '0',
  `completed` tinyint(1) DEFAULT '0',
  `completedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_courseId` (`userId`,`courseId`),
  KEY `userId` (`userId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `Enrollment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Enrollment_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Enrollment`
--

LOCK TABLES `Enrollment` WRITE;
/*!40000 ALTER TABLE `Enrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FAQ`
--

DROP TABLE IF EXISTS `FAQ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FAQ` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` longtext COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `categoryId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_faq_category` (`categoryId`),
  CONSTRAINT `fk_faq_category` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FAQ`
--

LOCK TABLES `FAQ` WRITE;
/*!40000 ALTER TABLE `FAQ` DISABLE KEYS */;
INSERT INTO `FAQ` VALUES ('6a3844a5-40cf-11f1-9c13-2c3b70e54e3f','بورس چیست؟','بورس مکانی برای خرید و فروش سهام و اوراق بهادار است.','2026-04-25 21:21:40','2026-04-25 21:21:40',NULL),('6a38a146-40cf-11f1-9c13-2c3b70e54e3f','ارزهای دیجیتال امن هستند؟','امنیت بستگی به نحوه محافظت از کلیدهای خصوصی دارد.','2026-04-25 21:21:40','2026-04-25 21:21:40',NULL),('6a390752-40cf-11f1-9c13-2c3b70e54e3f','چگونه سرمایه‌گذاری شروع کنم؟','ابتدا دانش اساسی کسب کنید سپس با مبالغ کم شروع کنید.','2026-04-25 21:21:40','2026-04-25 21:21:40',NULL),('73e2e437-40cf-11f1-9c13-2c3b70e54e3f','بورس چیست؟','بورس مکانی برای خرید و فروش سهام و اوراق بهادار است.','2026-04-25 21:21:57','2026-04-25 21:21:57',NULL),('73e32322-40cf-11f1-9c13-2c3b70e54e3f','ارزهای دیجیتال امن هستند؟','امنیت بستگی به نحوه محافظت از کلیدهای خصوصی دارد.','2026-04-25 21:21:57','2026-04-25 21:21:57',NULL),('73e37316-40cf-11f1-9c13-2c3b70e54e3f','چگونه سرمایه‌گذاری شروع کنم؟','ابتدا دانش اساسی کسب کنید سپس با مبالغ کم شروع کنید.','2026-04-25 21:21:57','2026-04-25 21:21:57',NULL);
/*!40000 ALTER TABLE `FAQ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomeLanding`
--

DROP TABLE IF EXISTS `HomeLanding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomeLanding` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mainHeroTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainHeroSubtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mainHeroCta1Link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `heroVideoUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `overlayTexts` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomeLanding`
--

LOCK TABLES `HomeLanding` WRITE;
/*!40000 ALTER TABLE `HomeLanding` DISABLE KEYS */;
INSERT INTO `HomeLanding` VALUES ('e9bd09b9-40d0-11f1-9c13-2c3b70e54e3f','{\"title\": \"پیشرو سرمایه\", \"description\": \"آموزش تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری\"}',1,1,'2026-04-25 21:32:24','2026-04-25 21:39:29','پیشرو بزرگترین مؤسسه سرمایه‌ گذاری در ایران','شروع مسیر موفقیت','/business-consulting','/videos/aboutUs.webm','[\"پیشرو در مسیر سرمایه‌ گذاری هوشمند\", \"ما در پیشرو با ارائه آموزش‌های تخصصی بورس، بازارهای مالی و سرمایه‌ گذاری، شما را در مسیر رشد مالی همراهی می‌کنیم.\", \"از آموزش اصولی و گام‌به‌گام تا مشاوره‌های حرفه‌ای و همراهی در مسیر رشد سرمایه شما، همه و همه در پیشرو فراهم است.\", \"پیشرو انتخابی مطمئن برای کسانی است که به دنبال امنیت مالی، رشد پایدار و آینده‌ای روشن هستند.\"]');
/*!40000 ALTER TABLE `HomeLanding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomeMiniSlider`
--

DROP TABLE IF EXISTS `HomeMiniSlider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomeMiniSlider` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `row` int DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomeMiniSlider`
--

LOCK TABLES `HomeMiniSlider` WRITE;
/*!40000 ALTER TABLE `HomeMiniSlider` DISABLE KEYS */;
/*!40000 ALTER TABLE `HomeMiniSlider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomeSlide`
--

DROP TABLE IF EXISTS `HomeSlide`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `HomeSlide` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomeSlide`
--

LOCK TABLES `HomeSlide` WRITE;
/*!40000 ALTER TABLE `HomeSlide` DISABLE KEYS */;
INSERT INTO `HomeSlide` VALUES ('1iqac9olb','دوره‌های آنلاین','یادگیری از بهترین متخصصان صنعت','https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',1,2,'2026-04-25 21:40:01','2026-04-25 21:40:01'),('4nm448587','شروع مسیر سرمایه‌ گذاری','آموزش جامع و تخصصی در زمینه سرمایه‌ گذاری و بورس','https://images.unsplash.com/photo-1579532537598-459e09a48b8d?auto=format&fit=crop&w=1200&q=80',1,1,'2026-04-25 21:40:01','2026-04-25 21:40:01'),('mm4f4uyrv','مشاوره تخصصی','راهنمایی فردی برای رشد سرمایه شما','https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',1,3,'2026-04-25 21:40:01','2026-04-25 21:40:01');
/*!40000 ALTER TABLE `HomeSlide` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Image`
--

DROP TABLE IF EXISTS `Image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Image` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Image_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Image`
--

LOCK TABLES `Image` WRITE;
/*!40000 ALTER TABLE `Image` DISABLE KEYS */;
/*!40000 ALTER TABLE `Image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvestmentModel`
--

DROP TABLE IF EXISTS `InvestmentModel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvestmentModel` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `investmentModelsPageId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gradient` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features` json DEFAULT NULL,
  `benefits` json DEFAULT NULL,
  `ctaText` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaLink` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaIsScroll` tinyint(1) DEFAULT '0',
  `contactTitle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `contacts` json DEFAULT NULL,
  `order` int DEFAULT '0',
  `published` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `investmentModelsPageId` (`investmentModelsPageId`),
  CONSTRAINT `InvestmentModel_ibfk_1` FOREIGN KEY (`investmentModelsPageId`) REFERENCES `InvestmentModelsPage` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvestmentModel`
--

LOCK TABLES `InvestmentModel` WRITE;
/*!40000 ALTER TABLE `InvestmentModel` DISABLE KEYS */;
INSERT INTO `InvestmentModel` VALUES ('637fd63f-459c-11f1-b7a4-2c3b70e54e3f','4dcf38d3-459c-11f1-b7a4-2c3b70e54e3f','in-person','مشاوره حضوری','دریافت مشاوره حضوری از متخصصین','Building2','green','from-green-500 to-emerald-600',NULL,NULL,'درخواست مشاوره','/contact',0,NULL,NULL,NULL,1,1,'2026-05-01 23:59:01','2026-05-01 23:59:01'),('63801467-459c-11f1-b7a4-2c3b70e54e3f','4dcf38d3-459c-11f1-b7a4-2c3b70e54e3f','online','مشاوره آنلاین','دریافت مشاوره آنلاین از هر جای جهان','Globe','blue','from-blue-500 to-cyan-600',NULL,NULL,'رزرو جلسه','/booking',0,NULL,NULL,NULL,2,1,'2026-05-01 23:59:01','2026-05-01 23:59:01'),('a3251666-45ab-11f1-b7a4-2c3b70e54e3f','4dcf38d3-459c-11f1-b7a4-2c3b70e54e3f','in-person','مشاوره حضوری','دریافت مشاوره حضوری از متخصصین','Building2','green','from-green-500 to-emerald-600',NULL,NULL,'درخواست مشاوره','/contact',0,NULL,NULL,NULL,1,1,'2026-05-02 01:48:10','2026-05-02 01:48:10'),('a3254f0d-45ab-11f1-b7a4-2c3b70e54e3f','4dcf38d3-459c-11f1-b7a4-2c3b70e54e3f','online','مشاوره آنلاین','دریافت مشاوره آنلاین از هر جای جهان','Globe','blue','from-blue-500 to-cyan-600',NULL,NULL,'رزرو جلسه','/booking',0,NULL,NULL,NULL,2,1,'2026-05-02 01:48:10','2026-05-02 01:48:10');
/*!40000 ALTER TABLE `InvestmentModel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvestmentModelsPage`
--

DROP TABLE IF EXISTS `InvestmentModelsPage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvestmentModelsPage` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `additionalInfoTitle` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additionalInfoContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvestmentModelsPage`
--

LOCK TABLES `InvestmentModelsPage` WRITE;
/*!40000 ALTER TABLE `InvestmentModelsPage` DISABLE KEYS */;
INSERT INTO `InvestmentModelsPage` VALUES ('4dcf38d3-459c-11f1-b7a4-2c3b70e54e3f','اطلاعات اضافی','برای اطلاعات بیشتر با ما تماس بگیرید',1,'2026-05-01 23:58:24','2026-05-01 23:58:24'),('a324ca7d-45ab-11f1-b7a4-2c3b70e54e3f','اطلاعات اضافی','برای اطلاعات بیشتر با ما تماس بگیرید',1,'2026-05-02 01:48:10','2026-05-02 01:48:10');
/*!40000 ALTER TABLE `InvestmentModelsPage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvestmentPlan`
--

DROP TABLE IF EXISTS `InvestmentPlan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvestmentPlan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `investmentPlansId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvestmentPlan`
--

LOCK TABLES `InvestmentPlan` WRITE;
/*!40000 ALTER TABLE `InvestmentPlan` DISABLE KEYS */;
INSERT INTO `InvestmentPlan` VALUES ('ohho1j4g2','سبد بورس','سرمایه‌گذاری در سهام بورس تهران','dujm8t0fu',1,1,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('plzzlx1d4','سبد ارز دیجیتال','سرمایه‌گذاری در ارز‌های دیجیتال','dujm8t0fu',1,2,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('yhuo8hk7g','سبد ترکیبی','ترکیب سرمایه‌گذاری برای کاهش ریسک','dujm8t0fu',1,3,'2026-04-25 22:13:22','2026-04-25 22:13:22');
/*!40000 ALTER TABLE `InvestmentPlan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvestmentPlans`
--

DROP TABLE IF EXISTS `InvestmentPlans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvestmentPlans` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDescription` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaKeywords` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvestmentPlans`
--

LOCK TABLES `InvestmentPlans` WRITE;
/*!40000 ALTER TABLE `InvestmentPlans` DISABLE KEYS */;
INSERT INTO `InvestmentPlans` VALUES ('dujm8t0fu','{\"title\":\"سبدهای سرمایه‌گذاری\",\"description\":\"انتخاب بهترین سبد سرمایه‌گذاری برای شما\"}',1,'2026-04-25 22:13:22','2026-04-26 17:42:53','سبدهای سرمایه‌ گذاری | پیشرو','آشنایی با سبدهای سرمایه‌ گذاری متنوع در ارز دیجیتال، بورس و ترکیبی',NULL);
/*!40000 ALTER TABLE `InvestmentPlans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InvestmentTag`
--

DROP TABLE IF EXISTS `InvestmentTag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InvestmentTag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `investmentPlansId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InvestmentTag`
--

LOCK TABLES `InvestmentTag` WRITE;
/*!40000 ALTER TABLE `InvestmentTag` DISABLE KEYS */;
INSERT INTO `InvestmentTag` VALUES ('dj9cj4l70','ریسک بالا','dujm8t0fu',1,3,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('oqwatvb19','بازده متوسط','dujm8t0fu',1,2,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('qks2jv7yf','ریسک پایین','dujm8t0fu',1,1,'2026-04-25 22:13:22','2026-04-25 22:13:22');
/*!40000 ALTER TABLE `InvestmentTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lesson`
--

DROP TABLE IF EXISTS `Lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lesson` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `videoUrl` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int DEFAULT '0',
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `Lesson_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lesson`
--

LOCK TABLES `Lesson` WRITE;
/*!40000 ALTER TABLE `Lesson` DISABLE KEYS */;
/*!40000 ALTER TABLE `Lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MobileScrollerStep`
--

DROP TABLE IF EXISTS `MobileScrollerStep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MobileScrollerStep` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MobileScrollerStep`
--

LOCK TABLES `MobileScrollerStep` WRITE;
/*!40000 ALTER TABLE `MobileScrollerStep` DISABLE KEYS */;
INSERT INTO `MobileScrollerStep` VALUES ('bdm0l8t4q','انتخاب دوره','دوره‌های مورد علاقه را انتخاب کنید',1,3,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('plh0og3qk','ثبت‌نام','حساب خود را ایجاد کنید',1,1,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('unjsq9z4o','تکمیل پروفایل','اطلاعات شخصی خود را کامل کنید',1,2,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('w33cims1r','شروع یادگیری','مسیر یادگیری خود را آغاز کنید',1,4,'2026-04-25 22:13:22','2026-04-25 22:13:22');
/*!40000 ALTER TABLE `MobileScrollerStep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `News`
--

DROP TABLE IF EXISTS `News`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `News` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '0',
  `publishedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `News`
--

LOCK TABLES `News` WRITE;
/*!40000 ALTER TABLE `News` DISABLE KEYS */;
INSERT INTO `News` VALUES ('9pxttwadz','ارز دیجیتال تحت نظارت','بانک مرکزی مقررات جدیدی برای ارز دیجیتال اعلام کرد',1,'2026-04-24 00:00:00','2026-04-25 22:13:22','2026-04-25 22:13:22'),('d4448klvu','دوره جدید آموزش','شروع دوره جدید آموزش تحلیل تکنیکال',1,'2026-04-23 00:00:00','2026-04-25 22:13:22','2026-04-25 22:13:22'),('pekuyo9uw','بازار بورس در حال صعود','شاخص کل بورس تهران به رکورد جدیدی رسید',1,'2026-04-25 00:00:00','2026-04-25 22:13:22','2026-04-25 22:13:22');
/*!40000 ALTER TABLE `News` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NewsComment`
--

DROP TABLE IF EXISTS `NewsComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NewsComment` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `newsId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `newsId` (`newsId`),
  CONSTRAINT `NewsComment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `NewsComment_ibfk_2` FOREIGN KEY (`newsId`) REFERENCES `News` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NewsComment`
--

LOCK TABLES `NewsComment` WRITE;
/*!40000 ALTER TABLE `NewsComment` DISABLE KEYS */;
/*!40000 ALTER TABLE `NewsComment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalPrice` int DEFAULT '0',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Order_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItem`
--

DROP TABLE IF EXISTS `OrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItem` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `OrderItem_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `OrderItem_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItem`
--

LOCK TABLES `OrderItem` WRITE;
/*!40000 ALTER TABLE `OrderItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Otp`
--

DROP TABLE IF EXISTS `Otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Otp` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Otp`
--

LOCK TABLES `Otp` WRITE;
/*!40000 ALTER TABLE `Otp` DISABLE KEYS */;
INSERT INTO `Otp` VALUES ('0ca53025-2dc4-45c0-89a6-504454def2aa','09199887711','7343','2026-05-01 19:04:12','2026-05-01 19:02:12'),('224b95e3-6ad5-4be8-bf63-0df47092d5c9','09191234567','2773','2026-05-14 16:16:59','2026-05-14 16:14:58'),('89928f28-084b-48a3-9daa-75275365751e','09199887722','6954','2026-05-01 19:06:44','2026-05-01 19:04:44'),('8b8a0352-52b2-4f4d-81b9-df2d13bb9b73','09030731480','3598','2026-05-15 23:07:36','2026-05-15 23:05:35'),('91563752-0a54-44fb-a9f0-5a799dcf62bf','09199887799','5926','2026-05-01 03:07:42','2026-05-01 03:05:41'),('a1a6c314-96ad-47c2-92ce-57071cccdff3','09111111111','4320','2026-05-15 23:04:45','2026-05-15 23:02:44'),('aae110a9-6dbd-4723-bcfa-93cd5a7f2db5','09351234567','8874','2026-05-14 16:19:02','2026-05-14 16:17:01'),('b3bc6f1f-6a31-489f-90fb-c88873781978','09655256784','5867','2026-05-14 10:08:52','2026-05-14 10:06:52'),('d64a4909-8cf5-4d9d-8383-1ee75f84ab30','09187654321','8508','2026-05-01 20:28:06','2026-05-01 20:26:05'),('d7ff1a60-7038-4fa1-8a78-797cd3caedf5','09456781234','7923','2026-05-14 16:26:34','2026-05-14 16:24:34'),('e33d2e92-1c93-4735-9eca-eb22f012c3c5','09199887788','6173','2026-05-01 03:06:18','2026-05-01 03:04:17');
/*!40000 ALTER TABLE `Otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Quiz`
--

DROP TABLE IF EXISTS `Quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Quiz` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `courseId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `Quiz_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Quiz`
--

LOCK TABLES `Quiz` WRITE;
/*!40000 ALTER TABLE `Quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `Quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuizAttempt`
--

DROP TABLE IF EXISTS `QuizAttempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QuizAttempt` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quizId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` double DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `quizId` (`quizId`),
  CONSTRAINT `QuizAttempt_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `QuizAttempt_ibfk_2` FOREIGN KEY (`quizId`) REFERENCES `Quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuizAttempt`
--

LOCK TABLES `QuizAttempt` WRITE;
/*!40000 ALTER TABLE `QuizAttempt` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuizAttempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ResumeItem`
--

DROP TABLE IF EXISTS `ResumeItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ResumeItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `aboutPageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ResumeItem`
--

LOCK TABLES `ResumeItem` WRITE;
/*!40000 ALTER TABLE `ResumeItem` DISABLE KEYS */;
INSERT INTO `ResumeItem` VALUES ('dm7v2ft67','تأسیس مؤسسه','شروع مسیر فعالیت در سال ۱۴۰۰','9u81dxnzv',1,1,'2026-04-25 22:13:21','2026-04-25 22:13:21'),('vmmd8enmj','پوشش ملی','فعالیت در سراسر کشور','9u81dxnzv',1,3,'2026-04-25 22:13:22','2026-04-25 22:13:22'),('w47d7hsg5','توسعه خدمات','افزایش خدمات و دوره‌های آموزشی','9u81dxnzv',1,2,'2026-04-25 22:13:21','2026-04-25 22:13:21');
/*!40000 ALTER TABLE `ResumeItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SkyRoomClass`
--

DROP TABLE IF EXISTS `SkyRoomClass`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SkyRoomClass` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meetingLink` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SkyRoomClass`
--

LOCK TABLES `SkyRoomClass` WRITE;
/*!40000 ALTER TABLE `SkyRoomClass` DISABLE KEYS */;
INSERT INTO `SkyRoomClass` VALUES ('6380973b-459c-11f1-b7a4-2c3b70e54e3f','https://skyroom.online/join/pishro-class-1',1,'2026-05-01 23:59:01','2026-05-01 23:59:01'),('6380988e-459c-11f1-b7a4-2c3b70e54e3f','https://skyroom.online/join/pishro-class-2',1,'2026-05-01 23:59:01','2026-05-01 23:59:01'),('a325b85d-45ab-11f1-b7a4-2c3b70e54e3f','https://skyroom.online/join/pishro-class-1',1,'2026-05-02 01:48:10','2026-05-02 01:48:10'),('a325bb2c-45ab-11f1-b7a4-2c3b70e54e3f','https://skyroom.online/join/pishro-class-2',1,'2026-05-02 01:48:10','2026-05-02 01:48:10');
/*!40000 ALTER TABLE `SkyRoomClass` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tag`
--

DROP TABLE IF EXISTS `Tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published` tinyint(1) DEFAULT '1',
  `usageCount` int DEFAULT '0',
  `clicks` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES ('6a33d8e0-40cf-11f1-9c13-2c3b70e54e3f','تحلیل تکنیکال','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a343476-40cf-11f1-9c13-2c3b70e54e3f','تحلیل بنیادی','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a349042-40cf-11f1-9c13-2c3b70e54e3f','بورس تهران','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a34e480-40cf-11f1-9c13-2c3b70e54e3f','ارز دیجیتال','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a35394c-40cf-11f1-9c13-2c3b70e54e3f','فارکس','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a3584da-40cf-11f1-9c13-2c3b70e54e3f','سهام بلندمدت','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a35c59c-40cf-11f1-9c13-2c3b70e54e3f','صندوق‌های سرمایه‌گذاری','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a35fe65-40cf-11f1-9c13-2c3b70e54e3f','اوراق قرضه','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a3636a3-40cf-11f1-9c13-2c3b70e54e3f','مدیریت ریسک','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0),('6a367f71-40cf-11f1-9c13-2c3b70e54e3f','تنوع سبد سرمایه‌گذاری','2026-04-25 21:21:40','2026-04-25 21:21:40',1,0,0);
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TeamMember`
--

DROP TABLE IF EXISTS `TeamMember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TeamMember` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aboutPageId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `order` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `specialties` json DEFAULT NULL,
  `education` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `linkedinUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitterUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsappUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telegramUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TeamMember`
--

LOCK TABLES `TeamMember` WRITE;
/*!40000 ALTER TABLE `TeamMember` DISABLE KEYS */;
INSERT INTO `TeamMember` VALUES ('15cx694x7','علی محمدی','مدیر آموزشی',NULL,'9u81dxnzv',1,2,'2026-04-25 22:13:22','2026-04-25 22:16:16','[\"تحلیل تکنیکال\", \"تحلیل بنیادی\", \"ریسک‌مدیریت\"]','کارشناسی ارشد مهندسی مالی','مدیر آموزشی و متخصص در تحلیل تکنیکال و تحلیل بنیادی',NULL,NULL,NULL,NULL,NULL,NULL),('f3hgg75wy','فاطمه جعفری','مدیر امور مالی',NULL,'9u81dxnzv',1,3,'2026-04-25 22:13:22','2026-04-25 22:16:16','[\"سیاست‌های مالی\", \"صندوق‌های سرمایه‌گذاری\", \"نقدشوندگی\"]','کارشناسی حسابداری و امور مالی','مدیر امور مالی و متخصص در سیاست‌های مالی و صندوق‌های سرمایه‌گذاری',NULL,NULL,NULL,NULL,NULL,NULL),('hxotpvpo3','رحیم‌الله احمدی','مدیر اجرایی',NULL,'9u81dxnzv',1,1,'2026-04-25 22:13:22','2026-04-25 22:16:16','[\"سرمایه‌گذاری استراتژیک\", \"مدیریت پرتفولیو\", \"تحلیل بازار\"]','دکتری امور مالی از دانشگاه تهران','مدیر اجرایی و بنیانگذار پیشرو سرمایه با بیش از 15 سال تجربه در صنعت',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `TeamMember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TempUser`
--

DROP TABLE IF EXISTS `TempUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TempUser` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TempUser`
--

LOCK TABLES `TempUser` WRITE;
/*!40000 ALTER TABLE `TempUser` DISABLE KEYS */;
INSERT INTO `TempUser` VALUES ('58f6e2f6-a896-4e1b-b38d-2601aa433aa9','09655256784','$2b$10$PE56x6DwNeKruBfcQDMT2e9G/cWuvV/84QAna0dj2BHfrP9QOef96','2026-05-14 10:06:52'),('5cbc12ed-ee21-49b3-ba8b-ccf04367d102','09187654321','$2b$10$xwuEq/JU2XZNz8jjapJ/P.toHFx6CEAYIdgh2XMmeKgClx8twB/d6','2026-05-01 20:26:05'),('69c0ec77-5abb-45ef-a5b0-fbfc337128a8','09456781234','$2b$10$F80LvM3WBk.ouzcO1JGFTex0yclFbrWQCJdp0ZDgj5mZloEfcwq3.','2026-05-14 16:24:34'),('7304d32c-34a4-4945-855b-a2d12e861470','09199887711','$2b$10$ocnaeJyuvkjNLhh38yWhzuQFqdnzbnc6vEKRxloRkgGheP4ZgBFZm','2026-05-01 19:02:12'),('7c81255e-b004-415e-b422-d4c5d9256dcc','09111111111','$2b$10$XJSVGpiWXDt58lG6V4Ow8O2syC4087llHB7QuHJsfhgZXpOalxb2u','2026-05-15 23:02:44'),('8ea333ba-66ac-4ab2-871f-19d78965b5d0','09351234567','$2b$10$hWDZx6WzZQCCj4kMN/xtp.bfg.JugEdlPQ.Li/TSUlK6QA8tPCr8K','2026-05-14 16:17:01'),('b513735b-47cc-497a-b21d-c6a87dba856b','09199887722','$2b$10$GrJ1jtYIlFpv26i9cBCMwOJFKyE5YoRGs1pkWdiTxC7g/udmaIkJW','2026-05-01 19:04:44'),('c41c99b2-235c-46d4-baa0-4acad6457d4a','09199887788','$2b$10$sEfgzxhaKIqnBIga8xMYn.SBEyxolf18xL8k.JEsltVR.4jaeqxSG','2026-05-01 03:04:17'),('e79c3e05-6180-4a05-b866-77bb44e0540d','09030731480','$2b$10$7enRCWBbUafLt13b8Zre2ua0ei6MGJI4KS97q.KdI3jQT.aY2L1a2','2026-05-15 23:05:35'),('fdb3aa74-c141-4c42-903f-3fe98001c86b','09191234567','$2b$10$Ye5rLrZnsnl0ZDLQ058bDOqRQ4hUVisljQP.wT9PLF27J8Ce/8kiy','2026-05-14 16:14:58');
/*!40000 ALTER TABLE `TempUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transaction`
--

DROP TABLE IF EXISTS `Transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Transaction` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PAYMENT',
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Transaction_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transaction`
--

LOCK TABLES `Transaction` WRITE;
/*!40000 ALTER TABLE `Transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `Transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneVerified` tinyint(1) DEFAULT '0',
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('668f549b-c9c7-4ef9-9c74-70e0753bcbe8','09123456789','$2b$10$Dqe.zHafTFRjlnOLtqojQ.2IQ7Yr.vZL2fZU2fsz9V9j7BVrerNrO',1,'ADMIN','مدیر','سیستم','admin@pishro.com','2026-05-10 02:03:38','2026-05-10 02:03:38'),('73e28a0f-40cf-11f1-9c13-2c3b70e54e3f','09987654321',NULL,1,'USER',NULL,NULL,NULL,'2026-04-25 21:21:57','2026-04-25 21:21:57'),('78c96250-e7ec-4029-a92a-3c259d2d3697','09167991896','$2b$10$D2LTnUQ8itNzC/CPPBMWqu0.8sV0f7sHGMoeWpcvnaZ5d.SuplJDy',1,'USER',NULL,NULL,NULL,'2026-05-14 16:28:27','2026-05-15 23:13:11'),('test-user-1','09121234567',NULL,1,'USER','تست','کاربر','test@example.com','2026-05-02 02:31:46','2026-05-02 02:31:46');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserInvestmentPortfolio`
--

DROP TABLE IF EXISTS `UserInvestmentPortfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserInvestmentPortfolio` (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `investmentPlanId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` int DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_investmentPlanId` (`userId`,`investmentPlanId`),
  KEY `userId` (`userId`),
  KEY `investmentPlanId` (`investmentPlanId`),
  CONSTRAINT `UserInvestmentPortfolio_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `UserInvestmentPortfolio_ibfk_2` FOREIGN KEY (`investmentPlanId`) REFERENCES `InvestmentPlan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserInvestmentPortfolio`
--

LOCK TABLES `UserInvestmentPortfolio` WRITE;
/*!40000 ALTER TABLE `UserInvestmentPortfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserInvestmentPortfolio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-15 23:37:22
