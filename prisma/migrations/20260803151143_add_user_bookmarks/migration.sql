-- CreateTable
CREATE TABLE `Bookmark` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NULL,
    `newsArticleId` VARCHAR(191) NULL,
    `digitalBookId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Bookmark_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `Bookmark_courseId_idx`(`courseId`),
    INDEX `Bookmark_newsArticleId_idx`(`newsArticleId`),
    INDEX `Bookmark_digitalBookId_idx`(`digitalBookId`),
    UNIQUE INDEX `Bookmark_userId_courseId_key`(`userId`, `courseId`),
    UNIQUE INDEX `Bookmark_userId_newsArticleId_key`(`userId`, `newsArticleId`),
    UNIQUE INDEX `Bookmark_userId_digitalBookId_key`(`userId`, `digitalBookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_newsArticleId_fkey` FOREIGN KEY (`newsArticleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_digitalBookId_fkey` FOREIGN KEY (`digitalBookId`) REFERENCES `DigitalBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
