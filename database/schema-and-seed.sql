-- ==========================================
-- پیشرو - Pishro Database Schema and Seed
-- ==========================================
-- یک فایل مرکزی برای ایجاد تمام جداول و داده‌های اولیه
-- Database: pishro
-- Character Set: utf8mb4
-- ==========================================

-- ==========================================
-- جداول کاربران و احراز هویت
-- ==========================================

-- جدول کاربران اصلی
CREATE TABLE IF NOT EXISTS `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci,
  `phoneVerified` tinyint(1) DEFAULT 0,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci,
  `nationalCode` varchar(191) COLLATE utf8mb4_unicode_ci,
  `birthDate` datetime,
  `avatarUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `cardNumber` varchar(191) COLLATE utf8mb4_unicode_ci,
  `shebaNumber` varchar(191) COLLATE utf8mb4_unicode_ci,
  `accountOwner` varchar(191) COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول کاربران موقتی (مرحله OTP)
CREATE TABLE IF NOT EXISTS `TempUser` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول OTP
CREATE TABLE IF NOT EXISTS `Otp` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول محتوای اصلی (دوره‌ها، درس‌ها و غیره)
-- ==========================================

-- جدول دسته‌بندی‌ها
CREATE TABLE IF NOT EXISTS `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول دوره‌ها
CREATE TABLE IF NOT EXISTS `Course` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `img` varchar(191) COLLATE utf8mb4_unicode_ci,
  `rating` double,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `discountPercent` int,
  `time` varchar(191) COLLATE utf8mb4_unicode_ci,
  `students` int,
  `videosCount` int,
  `introVideoUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci UNIQUE,
  `level` varchar(191) COLLATE utf8mb4_unicode_ci,
  `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'FA',
  `instructor` varchar(191) COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `published` tinyint(1) DEFAULT 1,
  `featured` tinyint(1) DEFAULT 0,
  `views` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول درس‌ها
CREATE TABLE IF NOT EXISTS `Lesson` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `videoUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `order` int DEFAULT 0,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول کامنت‌های دوره
CREATE TABLE IF NOT EXISTS `Comment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` double,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول ثبت‌نام دوره
CREATE TABLE IF NOT EXISTS `Enrollment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` double DEFAULT 0,
  `completed` tinyint(1) DEFAULT 0,
  `completedAt` datetime,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_courseId` (`userId`, `courseId`),
  KEY `userId` (`userId`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول تست و کوئیز
-- ==========================================

-- جدول کوئیز
CREATE TABLE IF NOT EXISTS `Quiz` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تلاش‌های کوئیز
CREATE TABLE IF NOT EXISTS `QuizAttempt` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quizId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` double,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `quizId` (`quizId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول سفارش و پرداخت
-- ==========================================

-- جدول سفارش‌ها
CREATE TABLE IF NOT EXISTS `Order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalPrice` int DEFAULT 0,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول آیتم‌های سفارش
CREATE TABLE IF NOT EXISTS `OrderItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تراکنش‌ها
CREATE TABLE IF NOT EXISTS `Transaction` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'PAYMENT',
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول صفحات استاتیک و محتوا
-- ==========================================

-- جدول درباره ما
CREATE TABLE IF NOT EXISTS `AboutPage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci,
  `metaDescription` varchar(500) COLLATE utf8mb4_unicode_ci,
  `metaKeywords` json,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول مشاوره تجاری
CREATE TABLE IF NOT EXISTS `BusinessConsulting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci,
  `metaDescription` varchar(500) COLLATE utf8mb4_unicode_ci,
  `metaKeywords` json,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول بخش‌های صفحه اصلی
CREATE TABLE IF NOT EXISTS `HomeLanding` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `mainHeroTitle` varchar(255) COLLATE utf8mb4_unicode_ci,
  `mainHeroSubtitle` varchar(255) COLLATE utf8mb4_unicode_ci,
  `mainHeroCta1Link` varchar(255) COLLATE utf8mb4_unicode_ci,
  `heroVideoUrl` varchar(255) COLLATE utf8mb4_unicode_ci,
  `overlayTexts` json,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول اسلاید‌های صفحه اصلی
CREATE TABLE IF NOT EXISTS `HomeSlide` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول اسلاید‌های کوچک صفحه اصلی
CREATE TABLE IF NOT EXISTS `HomeMiniSlider` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `row` int,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول مراحل اسکرول موبایل
CREATE TABLE IF NOT EXISTS `MobileScrollerStep` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول اخبار و نظرات
-- ==========================================

-- جدول اخبار
CREATE TABLE IF NOT EXISTS `News` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `publishedAt` datetime,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول نظرات اخبار
CREATE TABLE IF NOT EXISTS `NewsComment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `newsId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `newsId` (`newsId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول برنامه‌های سرمایه‌گذاری
-- ==========================================

-- جدول برنامه‌های سرمایه‌گذاری
CREATE TABLE IF NOT EXISTS `InvestmentPlan` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `investmentPlansId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول صفحه برنامه‌های سرمایه‌گذاری
CREATE TABLE IF NOT EXISTS `InvestmentPlans` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci,
  `metaDescription` varchar(500) COLLATE utf8mb4_unicode_ci,
  `metaKeywords` json,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تگ‌های سرمایه‌گذاری
CREATE TABLE IF NOT EXISTS `InvestmentTag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `investmentPlansId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول پورتفولیو سرمایه‌گذاری کاربر
CREATE TABLE IF NOT EXISTS `UserInvestmentPortfolio` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `investmentPlanId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `amount` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_investmentPlanId` (`userId`, `investmentPlanId`),
  KEY `userId` (`userId`),
  KEY `investmentPlanId` (`investmentPlanId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`investmentPlanId`) REFERENCES `InvestmentPlan`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول تکمیلی
-- ==========================================

-- جدول سوالات متداول
CREATE TABLE IF NOT EXISTS `FAQ` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` longtext COLLATE utf8mb4_unicode_ci,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تگ‌ها
CREATE TABLE IF NOT EXISTS `Tag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `published` tinyint(1) DEFAULT 1,
  `usageCount` int DEFAULT 0,
  `clicks` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تصاویر کاربر
CREATE TABLE IF NOT EXISTS `Image` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول گواهی‌نامه
CREATE TABLE IF NOT EXISTS `Certificate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `aboutPageId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول عضو تیم
CREATE TABLE IF NOT EXISTS `TeamMember` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `avatarUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `aboutPageId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `specialties` json,
  `education` varchar(255) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `linkedinUrl` varchar(255) COLLATE utf8mb4_unicode_ci,
  `emailUrl` varchar(255) COLLATE utf8mb4_unicode_ci,
  `twitterUrl` varchar(255) COLLATE utf8mb4_unicode_ci,
  `whatsappUrl` varchar(255) COLLATE utf8mb4_unicode_ci,
  `telegramUrl` varchar(255) COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول آیتم‌های رزومه
CREATE TABLE IF NOT EXISTS `ResumeItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `aboutPageId` varchar(191) COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 0,
  `order` int DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- درج داده‌های اولیه (Seeds)
-- ==========================================

-- درج دسته‌بندی‌های پیشفرض
INSERT IGNORE INTO Category (id, slug, title, description, published) 
VALUES 
  (UUID(), 'stock', 'بورس', 'آموزش کامل معاملات و تحلیل بورس', 1),
  (UUID(), 'cryptocurrency', 'ارزهای دیجیتال', 'آموزش جامع ارزهای دیجیتال و بلاک‌چین', 1),
  (UUID(), 'nft', 'NFT', 'آموزش NFT و دنیای هنر دیجیتال', 1),
  (UUID(), 'airdrop', 'ایردراپ', 'یادگیری روش‌های کسب توکن‌های رایگان', 1),
  (UUID(), 'metaverse', 'متاورس', 'سفری به دنیای متاورس و امکانات آن', 1);

-- درج دوره‌های نمونه
INSERT IGNORE INTO Course (id, subject, price, description, discountPercent, time, students, videosCount, instructor, slug, categoryId, level, published, status, language, rating, createdAt, updatedAt) 
SELECT 
  UUID(),
  'آموزش کامل بورس برای مبتدیان',
  299000,
  'دوره جامع برای یادگیری بورس از صفر تا صد',
  20,
  '12 ساعت',
  1250,
  45,
  'علی محمدی',
  'stock-beginner',
  c1.id,
  'BEGINNER',
  1,
  'ACTIVE',
  'FA',
  4.5,
  NOW(),
  NOW()
FROM Category c1 WHERE c1.slug = 'stock'
UNION ALL
SELECT 
  UUID(),
  'ارزهای دیجیتال و بلاک‌چین پیشرفته',
  399000,
  'دوره پیشرفته برای سرمایه‌گذاران حرفه‌ای',
  15,
  '20 ساعت',
  850,
  60,
  'فرزاد احمدی',
  'crypto-advanced',
  c2.id,
  'ADVANCED',
  1,
  'ACTIVE',
  'FA',
  4.7,
  NOW(),
  NOW()
FROM Category c2 WHERE c2.slug = 'cryptocurrency'
UNION ALL
SELECT 
  UUID(),
  'تحلیل تکنیکال بورس',
  349000,
  'آموزش تحلیل تکنیکال و الگوهای قیمتی',
  10,
  '16 ساعت',
  980,
  52,
  'مریم رضایی',
  'technical-analysis',
  c3.id,
  'INTERMEDIATE',
  1,
  'ACTIVE',
  'FA',
  4.6,
  NOW(),
  NOW()
FROM Category c3 WHERE c3.slug = 'stock'
UNION ALL
SELECT 
  UUID(),
  'NFT و توکن‌های دیجیتال',
  279000,
  'دوره کامل درباره NFT و هنر دیجیتال',
  25,
  '10 ساعت',
  650,
  35,
  'سارا کریمی',
  'nft-tokens',
  c4.id,
  'BEGINNER',
  1,
  'ACTIVE',
  'FA',
  4.4,
  NOW(),
  NOW()
FROM Category c4 WHERE c4.slug = 'nft'
UNION ALL
SELECT 
  UUID(),
  'ایردراپ و کسب توکن رایگان',
  199000,
  'روش‌های محافظت‌شده برای کسب توکن‌های رایگان',
  30,
  '8 ساعت',
  2100,
  28,
  'حسن پور',
  'airdrop-guide',
  c5.id,
  'BEGINNER',
  1,
  'ACTIVE',
  'FA',
  4.3,
  NOW(),
  NOW()
FROM Category c5 WHERE c5.slug = 'airdrop';

-- ==========================================
-- جداول تعاملات دوره (Like, Save, Comment)
-- ==========================================

-- جدول لایک‌های دوره
CREATE TABLE IF NOT EXISTS `CourseLike` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('LIKE', 'DISLIKE') DEFAULT 'LIKE',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_courseId` (`userId`, `courseId`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول ذخیره‌ی دوره‌ها
CREATE TABLE IF NOT EXISTS `CourseSave` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_courseId` (`userId`, `courseId`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول نظرات دوره
CREATE TABLE IF NOT EXISTS `CourseComment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `courseId` (`courseId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- جداول اضافی (Digital Book, Investment Models, SkyRoom)
-- ==========================================

-- جدول کتاب‌های دیجیتال
CREATE TABLE IF NOT EXISTS `DigitalBook` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `cover` varchar(191) COLLATE utf8mb4_unicode_ci,
  `publisher` varchar(191) COLLATE utf8mb4_unicode_ci,
  `year` int NOT NULL,
  `pages` int,
  `isbn` varchar(191) COLLATE utf8mb4_unicode_ci,
  `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'فارسی',
  `rating` double DEFAULT 0,
  `votes` int DEFAULT 0,
  `views` int DEFAULT 0,
  `downloads` int DEFAULT 0,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci,
  `formats` json,
  `status` json,
  `tags` json,
  `readingTime` varchar(191) COLLATE utf8mb4_unicode_ci,
  `isFeatured` tinyint(1) DEFAULT 0,
  `price` int,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `audioUrl` varchar(191) COLLATE utf8mb4_unicode_ci,
  `tagIds` json,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول صفحات مدل‌های سرمایه‌ گذاری
CREATE TABLE IF NOT EXISTS `InvestmentModelsPage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `additionalInfoTitle` varchar(191) COLLATE utf8mb4_unicode_ci,
  `additionalInfoContent` longtext COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول مدل‌های سرمایه‌ گذاری
CREATE TABLE IF NOT EXISTS `InvestmentModel` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `investmentModelsPageId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci,
  `gradient` varchar(191) COLLATE utf8mb4_unicode_ci,
  `features` json,
  `benefits` json,
  `ctaText` varchar(191) COLLATE utf8mb4_unicode_ci,
  `ctaLink` varchar(191) COLLATE utf8mb4_unicode_ci,
  `ctaIsScroll` tinyint(1) DEFAULT 0,
  `contactTitle` varchar(191) COLLATE utf8mb4_unicode_ci,
  `contactDescription` longtext COLLATE utf8mb4_unicode_ci,
  `contacts` json,
  `order` int DEFAULT 0,
  `published` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `investmentModelsPageId` (`investmentModelsPageId`),
  FOREIGN KEY (`investmentModelsPageId`) REFERENCES `InvestmentModelsPage`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول کلاس‌های SkyRoom
CREATE TABLE IF NOT EXISTS `SkyRoomClass` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meetingLink` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- درج داده‌های نمونه
-- ==========================================

-- درج صفحه مدل‌های سرمایه‌ گذاری
INSERT IGNORE INTO InvestmentModelsPage (id, additionalInfoTitle, additionalInfoContent, published, createdAt, updatedAt)
VALUES (UUID(), 'اطلاعات اضافی', 'برای اطلاعات بیشتر با ما تماس بگیرید', 1, NOW(), NOW());

-- درج مدل‌های سرمایه‌ گذاری
-- In-Person Model
INSERT IGNORE INTO InvestmentModel (id, investmentModelsPageId, type, title, description, icon, color, gradient, ctaText, ctaLink, `order`, published, createdAt, updatedAt)
SELECT 
  UUID(),
  (SELECT id FROM InvestmentModelsPage LIMIT 1),
  'in-person',
  'مشاوره حضوری',
  'دریافت مشاوره حضوری از متخصصین',
  'Building2',
  'green',
  'from-green-500 to-emerald-600',
  'درخواست مشاوره',
  '/contact',
  1,
  1,
  NOW(),
  NOW();

-- Online Model
INSERT IGNORE INTO InvestmentModel (id, investmentModelsPageId, type, title, description, icon, color, gradient, ctaText, ctaLink, `order`, published, createdAt, updatedAt)
SELECT 
  UUID(),
  (SELECT id FROM InvestmentModelsPage LIMIT 1),
  'online',
  'مشاوره آنلاین',
  'دریافت مشاوره آنلاین از هر جای جهان',
  'Globe',
  'blue',
  'from-blue-500 to-cyan-600',
  'رزرو جلسه',
  '/booking',
  2,
  1,
  NOW(),
  NOW();

-- درج کتاب‌های دیجیتال نمونه
INSERT IGNORE INTO DigitalBook (id, title, slug, author, description, publisher, year, pages, language, category, isFeatured, price, createdAt, updatedAt)
VALUES 
  (UUID(), 'راهنمای سرمایه‌ گذاری هوشمند', 'smart-investment-guide', 'احمد رضایی', 'کتاب جامع درباره سرمایه‌ گذاری و مدیریت سرمایه', 'انتشارات پیشرو', 2023, 250, 'فارسی', 'سرمایه‌ گذاری', 1, 99000, NOW(), NOW()),
  (UUID(), 'بورس برای مبتدیان', 'stock-market-beginners', 'علی محمدی', 'مقدمه‌ای ساده به دنیای بورس', 'انتشارات آموزش', 2023, 180, 'فارسی', 'بورس', 1, 79000, NOW(), NOW()),
  (UUID(), 'بلاک‌چین و ارزهای دیجیتال', 'blockchain-crypto', 'فرزاد احمدی', 'شناخت کامل فناوری بلاک‌چین و ارزهای دیجیتال', 'انتشارات تکنولوژی', 2023, 320, 'فارسی', 'ارزهای دیجیتال', 0, 149000, NOW(), NOW());

-- درج کلاس‌های SkyRoom نمونه
INSERT IGNORE INTO SkyRoomClass (id, meetingLink, published, createdAt, updatedAt)
VALUES 
  (UUID(), 'https://skyroom.online/join/pishro-class-1', 1, NOW(), NOW()),
  (UUID(), 'https://skyroom.online/join/pishro-class-2', 1, NOW(), NOW());

-- ==========================================
-- پایان فایل
-- ==========================================

