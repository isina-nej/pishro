-- AlterTable
ALTER TABLE `AdminUser` ADD COLUMN `phone` VARCHAR(20) UNIQUE,
ADD INDEX `AdminUser_phone_idx`(`phone`);
