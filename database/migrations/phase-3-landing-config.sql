-- =====================================================
-- Phase 3: Landing & Configuration Tables
-- =====================================================
-- This phase enhances landing page configurations
-- Estimated time: 1-2 hours
-- Dependencies: Phase 1-2 should be completed first
-- =====================================================

-- =====================================================
-- Phase 3.1: Enhance HomeLanding Table
-- =====================================================
ALTER TABLE `HomeLanding`
  DROP COLUMN `content`,
  ADD COLUMN `heroTitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `heroSubtitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `heroDescription` LONGTEXT COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `statsData` JSON DEFAULT '[]',
  ADD COLUMN `whyUsTitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `whyUsDescription` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `whyUsItems` JSON DEFAULT '[]',
  ADD COLUMN `newsClubTitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `newsClubDescription` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorTitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorDescription` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorRateLow` FLOAT DEFAULT 0.07,
  ADD COLUMN `calculatorRateMedium` FLOAT DEFAULT 0.08,
  ADD COLUMN `calculatorRateHigh` FLOAT DEFAULT 0.11,
  ADD COLUMN `calculatorPortfolioLowDesc` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorPortfolioMediumDesc` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorPortfolioHighDesc` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorAmountSteps` JSON,
  ADD COLUMN `calculatorDurationSteps` JSON,
  ADD COLUMN `calculatorInPersonPhone` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorOnlineTelegram` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `calculatorOnlineTelegramLink` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `metaTitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `metaDescription` VARCHAR(500) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `metaKeywords` JSON;

-- =====================================================
-- Phase 3.2: Enhance MobileScrollerStep Table
-- =====================================================
ALTER TABLE `MobileScrollerStep`
  ADD COLUMN `imageUrl` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `coverImageUrl` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `gradient` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  ADD COLUMN `link` VARCHAR(191) COLLATE utf8mb4_unicode_ci;

-- =====================================================
-- Phase 3.3: Create PageContent Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `PageContent` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `section` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `title` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `subtitle` VARCHAR(191) COLLATE utf8mb4_unicode_ci,
  `content` JSON,
  `language` VARCHAR(191) COLLATE utf8mb4_unicode_ci DEFAULT 'FA',
  `order` INT DEFAULT 0,
  `published` TINYINT(1) DEFAULT 1,
  `publishAt` DATETIME,
  `expireAt` DATETIME,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `categoryId_type` (`categoryId`, `type`),
  KEY `published_publishAt` (`published`, `publishAt`),
  FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Phase 3.4: Create SkyRoomClass Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `SkyRoomClass` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meetingLink` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Verification Steps
-- =====================================================
-- SELECT * FROM HomeLanding LIMIT 1;
-- SELECT * FROM MobileScrollerStep LIMIT 1;
-- SELECT COUNT(*) FROM PageContent;
-- SELECT COUNT(*) FROM SkyRoomClass;

-- =====================================================
-- Rollback Commands (If needed)
-- =====================================================
/*
-- Rollback Phase 3.1
ALTER TABLE HomeLanding
  DROP COLUMN heroTitle,
  DROP COLUMN heroSubtitle,
  DROP COLUMN heroDescription,
  DROP COLUMN statsData,
  DROP COLUMN whyUsTitle,
  DROP COLUMN whyUsDescription,
  DROP COLUMN whyUsItems,
  DROP COLUMN newsClubTitle,
  DROP COLUMN newsClubDescription,
  DROP COLUMN calculatorTitle,
  DROP COLUMN calculatorDescription,
  DROP COLUMN calculatorRateLow,
  DROP COLUMN calculatorRateMedium,
  DROP COLUMN calculatorRateHigh,
  DROP COLUMN calculatorPortfolioLowDesc,
  DROP COLUMN calculatorPortfolioMediumDesc,
  DROP COLUMN calculatorPortfolioHighDesc,
  DROP COLUMN calculatorAmountSteps,
  DROP COLUMN calculatorDurationSteps,
  DROP COLUMN calculatorInPersonPhone,
  DROP COLUMN calculatorOnlineTelegram,
  DROP COLUMN calculatorOnlineTelegramLink,
  DROP COLUMN metaTitle,
  DROP COLUMN metaDescription,
  DROP COLUMN metaKeywords,
  ADD COLUMN content LONGTEXT;

-- Rollback Phase 3.2
ALTER TABLE MobileScrollerStep
  DROP COLUMN imageUrl,
  DROP COLUMN coverImageUrl,
  DROP COLUMN gradient,
  DROP COLUMN link;

-- Rollback Phase 3.3
DROP TABLE IF EXISTS PageContent;

-- Rollback Phase 3.4
DROP TABLE IF EXISTS SkyRoomClass;
*/
