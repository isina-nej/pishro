/*
  Warnings:

  - You are about to drop the `ContentBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ContentBlock` DROP FOREIGN KEY `ContentBlock_newsId_fkey`;

-- DropForeignKey
ALTER TABLE `News` DROP FOREIGN KEY `News_categoryId_fkey`;

-- DropTable
DROP TABLE `ContentBlock`;

-- DropTable
DROP TABLE `News`;
