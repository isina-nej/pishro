-- AlterTable
ALTER TABLE `NewsArticle` ADD COLUMN `contentHtml` LONGTEXT NULL,
    ADD COLUMN `contentMarkdown` LONGTEXT NULL,
    ADD COLUMN `draftMarkdown` LONGTEXT NULL;
