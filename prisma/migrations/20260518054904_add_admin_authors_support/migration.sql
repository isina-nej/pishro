-- DropForeignKey
ALTER TABLE `News` DROP FOREIGN KEY `News_authorId_fkey`;

-- AlterTable
ALTER TABLE `News` MODIFY `authorId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
