-- AlterTable
ALTER TABLE `SiteSettings`
  ADD COLUMN `navbarItems` JSON NULL,
  ADD COLUMN `footerContent` JSON NULL;
