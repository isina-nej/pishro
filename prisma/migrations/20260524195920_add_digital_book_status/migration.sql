/*
  Warnings:

  - You are about to drop the column `status` on the `DigitalBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DigitalBook` DROP COLUMN `status`,
    ADD COLUMN `bookStatus` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT';
