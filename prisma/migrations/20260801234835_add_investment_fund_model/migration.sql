-- CreateTable
CREATE TABLE `InvestmentFund` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `monthlyRate` DOUBLE NOT NULL,
    `minDuration` INTEGER NOT NULL DEFAULT 1,
    `maxDuration` INTEGER NOT NULL DEFAULT 12,
    `durationStep` INTEGER NOT NULL DEFAULT 1,
    `minAmount` BIGINT NOT NULL DEFAULT 1000000,
    `maxAmount` BIGINT NOT NULL DEFAULT 5000000000,
    `amountStep` BIGINT NOT NULL DEFAULT 1000000,
    `order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InvestmentFund_key_key`(`key`),
    INDEX `InvestmentFund_active_order_idx`(`active`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
