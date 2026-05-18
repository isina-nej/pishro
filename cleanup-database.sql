-- 🧹 Complete Database Cleanup Script
-- This script safely deletes all data while keeping the schema intact

SET FOREIGN_KEY_CHECKS=0;

-- Delete data in dependency order (reverse of creation order)
DELETE FROM `NewsletterSubscriber`;
DELETE FROM `PageContent`;
DELETE FROM `FAQ`;
DELETE FROM `LandingPageFeature`;
DELETE FROM `LandingPage`;
DELETE FROM `DigitalBook`;
DELETE FROM `Transaction`;
DELETE FROM `OrderItem`;
DELETE FROM `Order`;
DELETE FROM `Enrollment`;
DELETE FROM `Question`;
DELETE FROM `Quiz`;
DELETE FROM `Comment`;
DELETE FROM `CourseOnTag`;
DELETE FROM `Course`;
DELETE FROM `NewsArticle`;
DELETE FROM `User`;
DELETE FROM `Tag`;
DELETE FROM `Category`;
DELETE FROM `AdminUser`;

-- Reset auto-increment counters (optional)
ALTER TABLE `AdminUser` AUTO_INCREMENT = 1;
ALTER TABLE `Category` AUTO_INCREMENT = 1;
ALTER TABLE `Tag` AUTO_INCREMENT = 1;
ALTER TABLE `User` AUTO_INCREMENT = 1;
ALTER TABLE `Course` AUTO_INCREMENT = 1;
ALTER TABLE `Comment` AUTO_INCREMENT = 1;
ALTER TABLE `Quiz` AUTO_INCREMENT = 1;
ALTER TABLE `Question` AUTO_INCREMENT = 1;
ALTER TABLE `Enrollment` AUTO_INCREMENT = 1;
ALTER TABLE `Order` AUTO_INCREMENT = 1;
ALTER TABLE `OrderItem` AUTO_INCREMENT = 1;
ALTER TABLE `Transaction` AUTO_INCREMENT = 1;
ALTER TABLE `NewsArticle` AUTO_INCREMENT = 1;
ALTER TABLE `DigitalBook` AUTO_INCREMENT = 1;
ALTER TABLE `FAQ` AUTO_INCREMENT = 1;
ALTER TABLE `PageContent` AUTO_INCREMENT = 1;
ALTER TABLE `LandingPage` AUTO_INCREMENT = 1;
ALTER TABLE `LandingPageFeature` AUTO_INCREMENT = 1;
ALTER TABLE `NewsletterSubscriber` AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS=1;

SELECT '✅ Database cleanup completed!' AS status;
