-- =====================================================
-- Phase 2: Create Content Management Tables
-- =====================================================

-- Create Video Table
CREATE TABLE IF NOT EXISTS `Video` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `thumbnail` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `duration` INT,
  `fileSize` BIGINT,
  `processingStatus` VARCHAR(191) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `uploadProgress` INT DEFAULT 0,
  `uploadedBy` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `uploadedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploadedBy` (`uploadedBy`),
  FOREIGN KEY (`uploadedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Image Table
CREATE TABLE IF NOT EXISTS `Image` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `width` INT,
  `height` INT,
  `fileSize` BIGINT,
  `uploadedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ContentBlock Table
CREATE TABLE IF NOT EXISTS `ContentBlock` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `newsId` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `content` JSON,
  `sortOrder` INT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_news_order` (`newsId`, `sortOrder`),
  KEY `newsId` (`newsId`),
  FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

