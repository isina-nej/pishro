-- CreateTable
CREATE TABLE `GuestChatConversation` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NULL,
    `status` ENUM('OPEN', 'ACTIVE', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `visitorToken` VARCHAR(191) NOT NULL,
    `lastMessageAt` DATETIME(3) NULL,
    `closedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GuestChatConversation_visitorToken_key`(`visitorToken`),
    INDEX `GuestChatConversation_status_lastMessageAt_idx`(`status`, `lastMessageAt`),
    INDEX `GuestChatConversation_phone_idx`(`phone`),
    INDEX `GuestChatConversation_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuestChatMessage` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `sender` ENUM('VISITOR', 'ADMIN') NOT NULL,
    `body` TEXT NOT NULL,
    `adminId` VARCHAR(191) NULL,
    `adminName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GuestChatMessage_conversationId_createdAt_idx`(`conversationId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuestChatMessage` ADD CONSTRAINT `GuestChatMessage_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `GuestChatConversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
