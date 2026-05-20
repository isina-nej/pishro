-- AlterTable
ALTER TABLE `NewsArticle` ADD COLUMN `contentType` ENUM('TEXT', 'HTML', 'MARKDOWN') NOT NULL DEFAULT 'HTML',
    ADD COLUMN `draft` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `draftContent` LONGTEXT NULL,
    ADD COLUMN `lastEditedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `NewsArticle_draft_idx` ON `NewsArticle`(`draft`);
