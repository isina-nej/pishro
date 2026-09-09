-- CreateTable
CREATE TABLE `GuestChatTopic` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `GuestChatTopic_published_order_idx` ON `GuestChatTopic`(`published`, `order`);

-- Seed the two default topics
INSERT INTO `GuestChatTopic` (`id`, `title`, `order`, `published`, `createdAt`, `updatedAt`) VALUES
  ('topic-courses', 'دوره‌های آموزشی', 0, true, NOW(3), NOW(3)),
  ('topic-funds', 'سبدهای سرمایه‌گذاری', 1, true, NOW(3), NOW(3));
