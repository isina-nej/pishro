/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `AdminUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `AdminUser` ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AdminUser_phone_key` ON `AdminUser`(`phone`);

-- CreateIndex
CREATE INDEX `AdminUser_phone_idx` ON `AdminUser`(`phone`);
