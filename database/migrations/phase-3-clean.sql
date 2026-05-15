-- =====================================================
-- Phase 3: Landing & Configuration Tables
-- =====================================================

-- Enhance HomeLanding Table
ALTER TABLE `HomeLanding`
  ADD COLUMN `heroTitle` VARCHAR(191),
  ADD COLUMN `heroSubtitle` VARCHAR(191),
  ADD COLUMN `heroDescription` LONGTEXT,
  ADD COLUMN `statsData` JSON,
  ADD COLUMN `whyUsTitle` VARCHAR(191),
  ADD COLUMN `whyUsDescription` VARCHAR(191),
  ADD COLUMN `whyUsItems` JSON,
  ADD COLUMN `newsClubTitle` VARCHAR(191),
  ADD COLUMN `newsClubDescription` VARCHAR(191),
  ADD COLUMN `calculatorTitle` VARCHAR(191),
  ADD COLUMN `calculatorDescription` VARCHAR(191),
  ADD COLUMN `calculatorRateLow` FLOAT DEFAULT 0.07,
  ADD COLUMN `calculatorRateMedium` FLOAT DEFAULT 0.08,
  ADD COLUMN `calculatorRateHigh` FLOAT DEFAULT 0.11,
  ADD COLUMN `calculatorPortfolioLowDesc` VARCHAR(191),
  ADD COLUMN `calculatorPortfolioMediumDesc` VARCHAR(191),
  ADD COLUMN `calculatorPortfolioHighDesc` VARCHAR(191),
  ADD COLUMN `calculatorAmountSteps` JSON,
  ADD COLUMN `calculatorDurationSteps` JSON,
  ADD COLUMN `calculatorInPersonPhone` VARCHAR(191),
  ADD COLUMN `calculatorOnlineTelegram` VARCHAR(191),
  ADD COLUMN `calculatorOnlineTelegramLink` VARCHAR(191),
  ADD COLUMN `metaTitle` VARCHAR(191),
  ADD COLUMN `metaDescription` VARCHAR(500),
  ADD COLUMN `metaKeywords` JSON;

-- Enhance MobileScrollerStep Table
ALTER TABLE `MobileScrollerStep`
  ADD COLUMN `imageUrl` VARCHAR(191),
  ADD COLUMN `coverImageUrl` VARCHAR(191),
  ADD COLUMN `gradient` VARCHAR(191),
  ADD COLUMN `link` VARCHAR(191);

-- Create PageContent Table
CREATE TABLE IF NOT EXISTS `PageContent` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` VARCHAR(191),
  `section` VARCHAR(191),
  `title` VARCHAR(191),
  `subtitle` VARCHAR(191),
  `content` JSON,
  `language` VARCHAR(191) DEFAULT 'FA',
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

-- Create SkyRoomClass Table
CREATE TABLE IF NOT EXISTS `SkyRoomClass` (
  `id` VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meetingLink` VARCHAR(191) NOT NULL,
  `published` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `published` (`published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
