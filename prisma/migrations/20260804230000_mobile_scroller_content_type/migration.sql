-- AlterTable: allow each phone-story step to show an image or embed a site page
ALTER TABLE `MobileScrollerStep`
  ADD COLUMN `contentType` VARCHAR(191) NOT NULL DEFAULT 'IMAGE',
  ADD COLUMN `pageUrl` VARCHAR(191) NULL;
