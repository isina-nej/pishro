-- =====================================================
-- Phase 2: Create Content Management Tables
-- =====================================================
-- This phase creates new tables for content management
-- Estimated time: 2-3 hours
-- Dependencies: Phase 1 must be completed first
-- =====================================================

-- =====================================================
-- Phase 2.1: Create Video Table
-- =====================================================
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

-- =====================================================
-- Phase 2.2: Create Image Table
-- =====================================================
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

-- =====================================================
-- Phase 2.3: Link Lesson to Video Table
-- =====================================================
-- Skip if foreign key already exists
ALTER TABLE `Lesson`
  ADD CONSTRAINT IF NOT EXISTS `fk_lesson_video` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL;

-- =====================================================
-- Phase 2.4: Create ContentBlock Table (for block-based News)
-- =====================================================
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

-- =====================================================
-- Phase 2.5: Enhance News Table
-- =====================================================
ALTER TABLE `News`
  ADD COLUMN `slug` VARCHAR(191) UNIQUE COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `description` VARCHAR(500) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `thumbnail` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `status` VARCHAR(191) COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT',
  ADD COLUMN `categoryId` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `authorId` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  MODIFY COLUMN `title` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  DROP COLUMN `content`,
  DROP COLUMN `published`;

-- Add foreign keys for News
ALTER TABLE `News`
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `authorId` (`authorId`),
  ADD KEY `status_publishedAt` (`status`, `publishedAt`),
  ADD CONSTRAINT `fk_news_category` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_news_author` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE;

-- =====================================================
-- Verification Steps
-- =====================================================
-- SELECT COUNT(*) FROM Video;
-- SELECT COUNT(*) FROM Image;
-- SELECT COUNT(*) FROM ContentBlock;
-- SELECT * FROM News LIMIT 1;

-- =====================================================
-- Rollback Commands (If needed)
-- =====================================================
/*
-- Rollback Phase 2.1
DROP TABLE IF EXISTS Video;

-- Rollback Phase 2.2
DROP TABLE IF EXISTS Image;

-- Rollback Phase 2.3
ALTER TABLE Lesson DROP CONSTRAINT fk_lesson_video;

-- Rollback Phase 2.4
DROP TABLE IF EXISTS ContentBlock;

-- Rollback Phase 2.5
ALTER TABLE News
  DROP CONSTRAINT fk_news_category,
  DROP CONSTRAINT fk_news_author,
  DROP COLUMN slug,
  DROP COLUMN description,
  DROP COLUMN thumbnail,
  DROP COLUMN status,
  DROP COLUMN categoryId,
  DROP COLUMN authorId,
  DROP COLUMN publishedAt,
  ADD COLUMN content LONGTEXT,
  ADD COLUMN published TINYINT DEFAULT 0;
*/
