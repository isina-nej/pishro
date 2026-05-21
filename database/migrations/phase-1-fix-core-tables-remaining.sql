-- =====================================================
-- Phase 1: Fix Core Tables - Remaining operations
-- =====================================================
-- Phase 1.1 (Comment Table) has already been applied
-- Executing Phase 1.2 onwards
-- =====================================================

-- =====================================================
-- Phase 1.2: Fix Order Table
-- =====================================================
ALTER TABLE `Order`
  CHANGE COLUMN `totalPrice` `total` INT NOT NULL DEFAULT 0,
  ADD COLUMN `items` JSON,
  ADD COLUMN `paymentRef` VARCHAR(191);

-- =====================================================
-- Phase 1.3: Enhance Quiz Table
-- =====================================================
ALTER TABLE `Quiz`
  ADD COLUMN `timeLimit` INT NULL,
  ADD COLUMN `passingScore` INT DEFAULT 70,
  ADD COLUMN `maxAttempts` INT NULL,
  ADD COLUMN `shuffleQuestions` TINYINT(1) DEFAULT 0,
  ADD COLUMN `shuffleAnswers` TINYINT(1) DEFAULT 0,
  ADD COLUMN `showResults` TINYINT(1) DEFAULT 1,
  ADD COLUMN `showCorrectAnswers` TINYINT(1) DEFAULT 1,
  ADD COLUMN `categoryId` VARCHAR(191),
  MODIFY COLUMN `courseId` VARCHAR(191) NULL;

-- Add index for categoryId
ALTER TABLE `Quiz` ADD KEY `categoryId` (`categoryId`);

-- =====================================================
-- Phase 1.4: Enhance Lesson Table
-- =====================================================
ALTER TABLE `Lesson`
  ADD COLUMN `videoId` VARCHAR(191),
  ADD COLUMN `thumbnail` VARCHAR(191),
  ADD COLUMN `duration` VARCHAR(191),
  ADD COLUMN `published` TINYINT(1) DEFAULT 1,
  ADD COLUMN `views` INT DEFAULT 0;

-- Add index for videoId (will link to Video table in Phase 2)
ALTER TABLE `Lesson` ADD KEY `videoId` (`videoId`);

-- =====================================================
-- Phase 1.5: Enhance Transaction Table
-- =====================================================
ALTER TABLE `Transaction`
  ADD COLUMN `orderId` VARCHAR(191),
  MODIFY COLUMN `userId` VARCHAR(191) NULL,
  ADD COLUMN `gateway` VARCHAR(191),
  ADD COLUMN `refNumber` VARCHAR(191),
  ADD COLUMN `description` VARCHAR(500);

-- Add index for orderId
ALTER TABLE `Transaction` ADD KEY `orderId` (`orderId`);
