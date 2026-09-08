-- Separate signup vs password-reset OTPs sharing one row per phone (Mantis #10).
-- Existing rows keep purpose 'signup' so old reset codes cannot validate.
ALTER TABLE `Otp` ADD COLUMN `purpose` VARCHAR(191) NOT NULL DEFAULT 'signup';
ALTER TABLE `Otp` DROP INDEX `Otp_phone_key`;
CREATE UNIQUE INDEX `Otp_phone_purpose_key` ON `Otp`(`phone`, `purpose`);
