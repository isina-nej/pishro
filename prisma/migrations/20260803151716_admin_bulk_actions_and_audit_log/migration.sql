-- AlterTable
ALTER TABLE `User` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Deal` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `SupportTicket` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `CustomerSegment` ADD COLUMN `archivedAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'ARCHIVE', 'RESTORE', 'PUBLISH', 'UNPUBLISH', 'LOGIN', 'LOGIN_FAILED', 'LOGOUT') NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `entityLabel` TEXT NULL,
    `adminId` VARCHAR(191) NULL,
    `adminName` VARCHAR(191) NULL,
    `batchSize` INTEGER NULL,
    `meta` JSON NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `AuditLog_adminId_idx`(`adminId`),
    INDEX `AuditLog_action_idx`(`action`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `User_archivedAt_idx` ON `User`(`archivedAt`);

-- CreateIndex
CREATE INDEX `Lead_archivedAt_idx` ON `Lead`(`archivedAt`);

-- CreateIndex
CREATE INDEX `Deal_archivedAt_idx` ON `Deal`(`archivedAt`);

-- CreateIndex
CREATE INDEX `SupportTicket_archivedAt_idx` ON `SupportTicket`(`archivedAt`);

-- CreateIndex
CREATE INDEX `CustomerSegment_archivedAt_idx` ON `CustomerSegment`(`archivedAt`);

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
