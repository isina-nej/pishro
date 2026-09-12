-- Add mobile (portrait) cover for news hero; NULL = reuse desktop coverImage
ALTER TABLE `NewsArticle` ADD COLUMN `coverImageMobile` VARCHAR(191) NULL AFTER `coverImage`;
