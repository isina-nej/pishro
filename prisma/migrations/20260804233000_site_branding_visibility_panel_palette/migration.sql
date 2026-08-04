-- AlterTable SiteSettings: branding, hidden pages, user-panel palette
ALTER TABLE `SiteSettings`
  ADD COLUMN `logoUrl` VARCHAR(191) NULL,
  ADD COLUMN `faviconUrl` VARCHAR(191) NULL,
  ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
  ADD COLUMN `hiddenPages` JSON NOT NULL,
  ADD COLUMN `userPanelPaletteId` VARCHAR(191) NOT NULL DEFAULT 'panel-royal-green';

-- MySQL JSON default workaround for existing rows
UPDATE `SiteSettings` SET `hiddenPages` = JSON_ARRAY() WHERE `hiddenPages` IS NULL;
