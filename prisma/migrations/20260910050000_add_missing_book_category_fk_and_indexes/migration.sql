-- Backfill schema drift from commit 7a560b5f which added Prisma fields
-- (DigitalBook.relatedCategory/categoryId, UserInvestmentPortfolio.order,
-- named @@index blocks) without a migration. Production DigitalBook has no
-- categoryId column, so any query touching the model fails with:
-- "The column `pishro.DigitalBook.categoryId` does not exist" (500).
--
-- Plain statements (no IF NOT EXISTS: MySQL 8.0 does not support it inside
-- ALTER TABLE). This migration has never applied anywhere yet, so it runs
-- exactly once per database.
--
-- Index renames from the drift diff (Comment_userId_fkey -> ..._idx etc.)
-- are deliberately omitted: those are MySQL auto-created FK backing indexes,
-- renaming them is cosmetic and risks colliding with FK constraint names.
-- Prisma never references index names at query time, so they are harmless.

-- 1. New nullable FK column on DigitalBook (no backfill: legacy `category`
-- string stays the source of truth, categoryId starts NULL)
ALTER TABLE `DigitalBook` ADD COLUMN `categoryId` VARCHAR(191) NULL;

-- 2. Missing indexes from the @@index blocks
CREATE INDEX `Order_status_idx` ON `Order`(`status`);
CREATE INDEX `Transaction_status_idx` ON `Transaction`(`status`);
CREATE INDEX `Transaction_createdAt_idx` ON `Transaction`(`createdAt`);

-- 3. Missing foreign keys (both sides verified orphan-free before deploy)
ALTER TABLE `DigitalBook` ADD CONSTRAINT `DigitalBook_categoryId_fkey`
  FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `UserInvestmentPortfolio` ADD CONSTRAINT `UserInvestmentPortfolio_orderId_fkey`
  FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
