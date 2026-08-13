-- AlterTable
ALTER TABLE `SiteSettings`
  ADD COLUMN `paletteId` VARCHAR(191) NOT NULL DEFAULT 'emerald-trust',
  ADD COLUMN `themeMode` VARCHAR(191) NOT NULL DEFAULT 'system';
