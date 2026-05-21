-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `phoneVerified` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `nationalCode` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `cardNumber` VARCHAR(191) NULL,
    `shebaNumber` VARCHAR(191) NULL,
    `accountOwner` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'MODERATOR', 'VIEWER') NOT NULL DEFAULT 'ADMIN',
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    INDEX `AdminUser_email_idx`(`email`),
    INDEX `AdminUser_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TempUser` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TempUser_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Otp` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Otp_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `img` VARCHAR(191) NULL,
    `rating` DOUBLE NULL,
    `description` LONGTEXT NULL,
    `discountPercent` INTEGER NULL,
    `time` VARCHAR(191) NULL,
    `students` INTEGER NULL,
    `videosCount` INTEGER NULL,
    `introVideoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `categoryId` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NULL,
    `level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NULL,
    `language` ENUM('FA', 'EN') NOT NULL DEFAULT 'FA',
    `prerequisites` JSON NOT NULL,
    `learningGoals` JSON NOT NULL,
    `instructor` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'COMING_SOON', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Course_slug_key`(`slug`),
    INDEX `Course_categoryId_idx`(`categoryId`),
    INDEX `Course_published_featured_idx`(`published`, `featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NULL,
    `userAvatar` VARCHAR(191) NULL,
    `userRole` ENUM('STUDENT', 'PROFESSIONAL_TRADER', 'INVESTOR') NULL,
    `userCompany` VARCHAR(191) NULL,
    `text` VARCHAR(191) NOT NULL,
    `rating` INTEGER NULL,
    `courseId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `likes` JSON NOT NULL,
    `dislikes` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Comment_courseId_published_idx`(`courseId`, `published`),
    INDEX `Comment_categoryId_published_idx`(`categoryId`, `published`),
    INDEX `Comment_featured_idx`(`featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `items` JSON NOT NULL,
    `total` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `paymentRef` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `NewsletterSubscriber_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrollment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `enrolledAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `progress` INTEGER NOT NULL DEFAULT 0,
    `completedAt` DATETIME(3) NULL,
    `lastAccessAt` DATETIME(3) NULL,

    UNIQUE INDEX `Enrollment_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `amount` INTEGER NOT NULL,
    `type` ENUM('PAYMENT', 'REFUND', 'WITHDRAWAL') NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `gateway` VARCHAR(191) NULL,
    `refNumber` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NULL,
    `portfolioType` VARCHAR(191) NULL,
    `portfolioAmount` INTEGER NULL,
    `portfolioDuration` INTEGER NULL,
    `price` INTEGER NOT NULL,
    `discountPercent` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `videoId` VARCHAR(191) NULL,
    `videoUrl` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `views` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Lesson_courseId_order_idx`(`courseId`, `order`),
    INDEX `Lesson_courseId_published_idx`(`courseId`, `published`),
    INDEX `Lesson_videoId_idx`(`videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsArticle` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` LONGTEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `coverImage` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `tags` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `categoryId` VARCHAR(191) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `readingTime` INTEGER NULL,
    `likes` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `aboutPageId` VARCHAR(191) NULL,

    UNIQUE INDEX `NewsArticle_slug_key`(`slug`),
    INDEX `NewsArticle_categoryId_idx`(`categoryId`),
    INDEX `NewsArticle_published_featured_idx`(`published`, `featured`),
    INDEX `NewsArticle_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsComment` (
    `id` VARCHAR(191) NOT NULL,
    `articleId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `content` VARCHAR(191) NOT NULL,
    `likes` JSON NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `categoryId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `publishedAt` DATETIME(3) NULL,

    UNIQUE INDEX `News_slug_key`(`slug`),
    INDEX `News_status_publishedAt_idx`(`status`, `publishedAt`),
    INDEX `News_categoryId_idx`(`categoryId`),
    INDEX `News_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContentBlock` (
    `id` VARCHAR(191) NOT NULL,
    `newsId` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'HEADING', 'IMAGE', 'GALLERY', 'QUOTE', 'LIST') NOT NULL,
    `content` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `ContentBlock_newsId_idx`(`newsId`),
    UNIQUE INDEX `ContentBlock_newsId_sortOrder_key`(`newsId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DigitalBook` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `cover` VARCHAR(191) NULL,
    `publisher` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL,
    `pages` INTEGER NULL,
    `isbn` VARCHAR(191) NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'فارسی',
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `votes` INTEGER NOT NULL DEFAULT 0,
    `views` INTEGER NOT NULL DEFAULT 0,
    `downloads` INTEGER NOT NULL DEFAULT 0,
    `category` VARCHAR(191) NOT NULL,
    `formats` JSON NOT NULL,
    `status` JSON NOT NULL,
    `tags` JSON NOT NULL,
    `readingTime` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `price` INTEGER NULL,
    `fileUrl` VARCHAR(191) NULL,
    `audioUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `DigitalBook_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `coverImage` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` JSON NOT NULL,
    `heroTitle` VARCHAR(191) NULL,
    `heroSubtitle` VARCHAR(191) NULL,
    `heroDescription` VARCHAR(191) NULL,
    `heroImage` VARCHAR(191) NULL,
    `heroCta1Text` VARCHAR(191) NULL,
    `heroCta1Link` VARCHAR(191) NULL,
    `heroCta2Text` VARCHAR(191) NULL,
    `heroCta2Link` VARCHAR(191) NULL,
    `aboutTitle1` VARCHAR(191) NULL,
    `aboutTitle2` VARCHAR(191) NULL,
    `aboutDescription` VARCHAR(191) NULL,
    `aboutImage` VARCHAR(191) NULL,
    `aboutCta1Text` VARCHAR(191) NULL,
    `aboutCta1Link` VARCHAR(191) NULL,
    `aboutCta2Text` VARCHAR(191) NULL,
    `aboutCta2Link` VARCHAR(191) NULL,
    `statsBoxes` JSON NULL,
    `enableUserLevelSection` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    INDEX `Category_published_featured_idx`(`published`, `featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `published` BOOLEAN NULL DEFAULT false,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Tag_slug_key`(`slug`),
    INDEX `Tag_usageCount_idx`(`usageCount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseTags` (
    `courseId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `CourseTags_courseId_idx`(`courseId`),
    INDEX `CourseTags_tagId_idx`(`tagId`),
    PRIMARY KEY (`courseId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsArticleTags` (
    `newsArticleId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `NewsArticleTags_newsArticleId_idx`(`newsArticleId`),
    INDEX `NewsArticleTags_tagId_idx`(`tagId`),
    PRIMARY KEY (`newsArticleId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DigitalBookTags` (
    `digitalBookId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `DigitalBookTags_digitalBookId_idx`(`digitalBookId`),
    INDEX `DigitalBookTags_tagId_idx`(`tagId`),
    PRIMARY KEY (`digitalBookId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryTags` (
    `categoryId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    INDEX `CategoryTags_categoryId_idx`(`categoryId`),
    INDEX `CategoryTags_tagId_idx`(`tagId`),
    PRIMARY KEY (`categoryId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageContent` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `type` ENUM('LANDING', 'ABOUT', 'FEATURES', 'FAQ', 'TESTIMONIAL', 'HERO', 'STATS') NOT NULL,
    `section` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `subtitle` VARCHAR(191) NULL,
    `content` JSON NOT NULL,
    `language` ENUM('FA', 'EN') NOT NULL DEFAULT 'FA',
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `publishAt` DATETIME(3) NULL,
    `expireAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `PageContent_categoryId_type_idx`(`categoryId`, `type`),
    INDEX `PageContent_published_publishAt_idx`(`published`, `publishAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NULL,
    `faqCategory` ENUM('GENERAL', 'PAYMENT', 'COURSES', 'TECHNICAL') NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `helpful` INTEGER NOT NULL DEFAULT 0,
    `notHelpful` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `FAQ_categoryId_published_idx`(`categoryId`, `published`),
    INDEX `FAQ_faqCategory_idx`(`faqCategory`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `courseId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `timeLimit` INTEGER NULL,
    `passingScore` INTEGER NOT NULL DEFAULT 70,
    `maxAttempts` INTEGER NULL,
    `shuffleQuestions` BOOLEAN NOT NULL DEFAULT false,
    `shuffleAnswers` BOOLEAN NOT NULL DEFAULT false,
    `showResults` BOOLEAN NOT NULL DEFAULT true,
    `showCorrectAnswers` BOOLEAN NOT NULL DEFAULT true,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Quiz_courseId_published_idx`(`courseId`, `published`),
    INDEX `Quiz_categoryId_published_idx`(`categoryId`, `published`),
    INDEX `Quiz_published_order_idx`(`published`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `questionType` ENUM('MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER') NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    `options` JSON NOT NULL,
    `correctAnswer` BOOLEAN NULL,
    `explanation` VARCHAR(191) NULL,
    `points` INTEGER NOT NULL DEFAULT 1,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `QuizQuestion_quizId_order_idx`(`quizId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuizAttempt` (
    `id` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `answers` JSON NOT NULL,
    `score` DOUBLE NOT NULL,
    `totalPoints` INTEGER NOT NULL,
    `maxPoints` INTEGER NOT NULL,
    `passed` BOOLEAN NOT NULL DEFAULT false,
    `timeSpent` INTEGER NULL,
    `startedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `QuizAttempt_quizId_userId_idx`(`quizId`, `userId`),
    INDEX `QuizAttempt_userId_completedAt_idx`(`userId`, `completedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeLanding` (
    `id` VARCHAR(191) NOT NULL,
    `mainHeroTitle` VARCHAR(191) NULL,
    `mainHeroSubtitle` VARCHAR(191) NULL,
    `mainHeroCta1Text` VARCHAR(191) NULL,
    `mainHeroCta1Link` VARCHAR(191) NULL,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NULL,
    `heroDescription` VARCHAR(191) NULL,
    `heroVideoUrl` VARCHAR(191) NULL,
    `heroCta1Text` VARCHAR(191) NULL,
    `heroCta1Link` VARCHAR(191) NULL,
    `overlayTexts` JSON NOT NULL,
    `statsData` JSON NOT NULL,
    `whyUsTitle` VARCHAR(191) NULL,
    `whyUsDescription` LONGTEXT NULL,
    `whyUsItems` JSON NOT NULL,
    `newsClubTitle` VARCHAR(191) NULL,
    `newsClubDescription` LONGTEXT NULL,
    `calculatorTitle` VARCHAR(191) NULL,
    `calculatorDescription` LONGTEXT NULL,
    `calculatorRateLow` DOUBLE NULL DEFAULT 0.07,
    `calculatorRateMedium` DOUBLE NULL DEFAULT 0.08,
    `calculatorRateHigh` DOUBLE NULL DEFAULT 0.11,
    `calculatorPortfolioLowDesc` VARCHAR(191) NULL,
    `calculatorPortfolioMediumDesc` VARCHAR(191) NULL,
    `calculatorPortfolioHighDesc` VARCHAR(191) NULL,
    `calculatorAmountSteps` JSON NOT NULL,
    `calculatorDurationSteps` JSON NOT NULL,
    `calculatorInPersonPhone` VARCHAR(191) NULL,
    `calculatorOnlineTelegram` VARCHAR(191) NULL,
    `calculatorOnlineTelegramLink` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MobileScrollerStep` (
    `id` VARCHAR(191) NOT NULL,
    `stepNumber` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `coverImageUrl` VARCHAR(191) NULL,
    `gradient` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `MobileScrollerStep_published_order_idx`(`published`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AboutPage` (
    `id` VARCHAR(191) NOT NULL,
    `heroTitle` VARCHAR(191) NOT NULL DEFAULT '',
    `heroSubtitle` VARCHAR(191) NULL,
    `heroDescription` VARCHAR(191) NULL,
    `heroBadgeText` VARCHAR(191) NULL,
    `doctorIntroVideoUrl` VARCHAR(191) NULL,
    `heroStats` JSON NOT NULL,
    `resumeTitle` VARCHAR(191) NULL,
    `resumeSubtitle` VARCHAR(191) NULL,
    `teamTitle` VARCHAR(191) NULL,
    `teamSubtitle` VARCHAR(191) NULL,
    `certificatesTitle` VARCHAR(191) NULL,
    `certificatesSubtitle` VARCHAR(191) NULL,
    `newsTitle` VARCHAR(191) NULL,
    `newsSubtitle` VARCHAR(191) NULL,
    `ctaTitle` VARCHAR(191) NULL,
    `ctaDescription` VARCHAR(191) NULL,
    `ctaButtonText` VARCHAR(191) NULL,
    `ctaButtonLink` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResumeItem` (
    `id` VARCHAR(191) NOT NULL,
    `aboutPageId` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `bgColor` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `ResumeItem_aboutPageId_order_idx`(`aboutPageId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `aboutPageId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `role` VARCHAR(191) NOT NULL DEFAULT '',
    `image` VARCHAR(191) NULL,
    `education` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `specialties` JSON NOT NULL,
    `linkedinUrl` VARCHAR(191) NULL,
    `emailUrl` VARCHAR(191) NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `whatsappUrl` VARCHAR(191) NULL,
    `telegramUrl` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `TeamMember_aboutPageId_order_idx`(`aboutPageId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificate` (
    `id` VARCHAR(191) NOT NULL,
    `aboutPageId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Certificate_aboutPageId_order_idx`(`aboutPageId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessConsulting` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `telegramId` VARCHAR(191) NULL,
    `telegramLink` VARCHAR(191) NULL,
    `coursesLink` VARCHAR(191) NULL,
    `inPersonTitle` VARCHAR(191) NULL,
    `inPersonDescription` VARCHAR(191) NULL,
    `onlineTitle` VARCHAR(191) NULL,
    `onlineDescription` VARCHAR(191) NULL,
    `coursesTitle` VARCHAR(191) NULL,
    `coursesDescription` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvestmentPlans` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `plansIntroCards` JSON NOT NULL,
    `minAmount` INTEGER NOT NULL DEFAULT 10,
    `maxAmount` INTEGER NOT NULL DEFAULT 10000,
    `amountStep` INTEGER NOT NULL DEFAULT 10,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvestmentPlan` (
    `id` VARCHAR(191) NOT NULL,
    `investmentPlansId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `InvestmentPlan_investmentPlansId_order_idx`(`investmentPlansId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvestmentTag` (
    `id` VARCHAR(191) NOT NULL,
    `investmentPlansId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `InvestmentTag_investmentPlansId_order_idx`(`investmentPlansId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeSlide` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `HomeSlide_published_order_idx`(`published`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeMiniSlider` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `row` INTEGER NOT NULL DEFAULT 1,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `HomeMiniSlider_published_row_order_idx`(`published`, `row`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkyRoomClass` (
    `id` VARCHAR(191) NOT NULL,
    `meetingLink` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `SkyRoomClass_published_idx`(`published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInvestmentPortfolio` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `portfolioType` VARCHAR(191) NOT NULL,
    `portfolioAmount` INTEGER NOT NULL,
    `portfolioDuration` INTEGER NOT NULL,
    `expectedReturn` DOUBLE NOT NULL,
    `monthlyRate` DOUBLE NOT NULL,
    `purchasePrice` INTEGER NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `purchasedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `excelFileUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `UserInvestmentPortfolio_userId_status_idx`(`userId`, `status`),
    INDEX `UserInvestmentPortfolio_status_endDate_idx`(`status`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `originalPath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `fileFormat` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NULL,
    `hlsPlaylistPath` VARCHAR(191) NULL,
    `hlsSegmentsPath` VARCHAR(191) NULL,
    `processingStatus` ENUM('UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED') NOT NULL DEFAULT 'UPLOADING',
    `processingError` VARCHAR(191) NULL,
    `thumbnailPath` VARCHAR(191) NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `bitrate` INTEGER NULL,
    `codec` VARCHAR(191) NULL,
    `frameRate` DOUBLE NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Video_videoId_key`(`videoId`),
    INDEX `Video_processingStatus_idx`(`processingStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `alt` VARCHAR(191) NULL,
    `uploadedById` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `category` ENUM('PROFILE', 'COURSE', 'BOOK', 'NEWS', 'RESUME', 'CERTIFICATE', 'TEAM', 'LANDING', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `tags` JSON NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `Image_uploadedById_idx`(`uploadedById`),
    INDEX `Image_category_idx`(`category`),
    INDEX `Image_published_idx`(`published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` VARCHAR(191) NOT NULL,
    `zarinpalMerchantId` VARCHAR(191) NULL,
    `siteName` VARCHAR(191) NULL,
    `siteDescription` VARCHAR(191) NULL,
    `supportEmail` VARCHAR(191) NULL,
    `supportPhone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvestmentModelsPage` (
    `id` VARCHAR(191) NOT NULL,
    `additionalInfoTitle` VARCHAR(191) NULL,
    `additionalInfoContent` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvestmentModel` (
    `id` VARCHAR(191) NOT NULL,
    `investmentModelsPageId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `gradient` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,
    `benefits` JSON NOT NULL,
    `ctaText` VARCHAR(191) NOT NULL,
    `ctaLink` VARCHAR(191) NULL,
    `ctaIsScroll` BOOLEAN NOT NULL DEFAULT false,
    `contactTitle` VARCHAR(191) NULL,
    `contactDescription` VARCHAR(191) NULL,
    `contacts` JSON NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `InvestmentModel_investmentModelsPageId_order_idx`(`investmentModelsPageId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_aboutPageId_fkey` FOREIGN KEY (`aboutPageId`) REFERENCES `AboutPage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsComment` ADD CONSTRAINT `NewsComment_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsComment` ADD CONSTRAINT `NewsComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentBlock` ADD CONSTRAINT `ContentBlock_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseTags` ADD CONSTRAINT `CourseTags_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseTags` ADD CONSTRAINT `CourseTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticleTags` ADD CONSTRAINT `NewsArticleTags_newsArticleId_fkey` FOREIGN KEY (`newsArticleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticleTags` ADD CONSTRAINT `NewsArticleTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DigitalBookTags` ADD CONSTRAINT `DigitalBookTags_digitalBookId_fkey` FOREIGN KEY (`digitalBookId`) REFERENCES `DigitalBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DigitalBookTags` ADD CONSTRAINT `DigitalBookTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryTags` ADD CONSTRAINT `CategoryTags_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryTags` ADD CONSTRAINT `CategoryTags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageContent` ADD CONSTRAINT `PageContent_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FAQ` ADD CONSTRAINT `FAQ_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizQuestion` ADD CONSTRAINT `QuizQuestion_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResumeItem` ADD CONSTRAINT `ResumeItem_aboutPageId_fkey` FOREIGN KEY (`aboutPageId`) REFERENCES `AboutPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamMember` ADD CONSTRAINT `TeamMember_aboutPageId_fkey` FOREIGN KEY (`aboutPageId`) REFERENCES `AboutPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificate` ADD CONSTRAINT `Certificate_aboutPageId_fkey` FOREIGN KEY (`aboutPageId`) REFERENCES `AboutPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvestmentPlan` ADD CONSTRAINT `InvestmentPlan_investmentPlansId_fkey` FOREIGN KEY (`investmentPlansId`) REFERENCES `InvestmentPlans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvestmentTag` ADD CONSTRAINT `InvestmentTag_investmentPlansId_fkey` FOREIGN KEY (`investmentPlansId`) REFERENCES `InvestmentPlans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInvestmentPortfolio` ADD CONSTRAINT `UserInvestmentPortfolio_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvestmentModel` ADD CONSTRAINT `InvestmentModel_investmentModelsPageId_fkey` FOREIGN KEY (`investmentModelsPageId`) REFERENCES `InvestmentModelsPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
