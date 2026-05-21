-- =====================================================
-- Phase 2: Enhance News Table
-- =====================================================

-- Add new columns to News table (handling potential duplicates)
SET @dbname = DATABASE();
SET @tablename = 'News';

-- Check and add slug column
SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='slug') = 0,
  'ALTER TABLE `News` ADD COLUMN `slug` VARCHAR(191) UNIQUE COLLATE utf8mb4_unicode_ci',
  'SELECT 1'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- Check and add description column
SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='description') = 0,
  'ALTER TABLE `News` ADD COLUMN `description` VARCHAR(500) COLLATE utf8mb4_unicode_ci',
  'SELECT 1'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- Check and add thumbnail column
SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='thumbnail') = 0,
  'ALTER TABLE `News` ADD COLUMN `thumbnail` VARCHAR(191) COLLATE utf8mb4_unicode_ci',
  'SELECT 1'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- Check and add status column
SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='status') = 0,
  'ALTER TABLE `News` ADD COLUMN `status` VARCHAR(191) DEFAULT "DRAFT" COLLATE utf8mb4_unicode_ci',
  'SELECT 1'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- Check and add categoryId column
SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='categoryId') = 0,
  'ALTER TABLE `News` ADD COLUMN `categoryId` VARCHAR(191) COLLATE utf8mb4_unicode_ci',
  'SELECT 1'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- Check and add authorId column
SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tablename AND COLUMN_NAME='authorId') = 0,
  'ALTER TABLE `News` ADD COLUMN `authorId` VARCHAR(191) COLLATE utf8mb4_unicode_ci',
  'SELECT 1'
) INTO @sql;
PREPARE stmt FROM @sql;
EXECUTE stmt;

SELECT 'Phase 2 News table enhancement completed' AS message;
