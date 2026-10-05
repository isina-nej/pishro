-- ویدیوهای موجود پیش‌فرض بی‌صدا (mutedByDefault=1)
ALTER TABLE `Lesson` ADD COLUMN `mutedByDefault` TINYINT(1) NOT NULL DEFAULT 1;
ALTER TABLE `Course` ADD COLUMN `introMutedByDefault` TINYINT(1) NOT NULL DEFAULT 1;
