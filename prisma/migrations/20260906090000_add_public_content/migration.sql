-- Add page-level editable copy for the public-site CMS.
ALTER TABLE `SiteSettings` ADD COLUMN `publicContent` JSON NULL;
