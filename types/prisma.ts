/**
 * Type definitions replacing Prisma Client exports
 * These types are derived from the database schema
 */

// ============= ENUMS =============

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type UserRoleType = "USER" | "ADMIN" | "STUDENT" | "PROFESSIONAL_TRADER" | "INVESTOR";

export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum Language {
  FA = "FA",
  EN = "EN",
}

export enum CourseStatus {
  ACTIVE = "ACTIVE",
  COMING_SOON = "COMING_SOON",
  ARCHIVED = "ARCHIVED",
}

export enum FAQCategory {
  GENERAL = "GENERAL",
  PAYMENT = "PAYMENT",
  TECHNICAL = "TECHNICAL",
  CONTENT = "CONTENT",
  OTHER = "OTHER",
}

export enum PageContentType {
  LANDING = "LANDING",
  ABOUT = "ABOUT",
  FEATURES = "FEATURES",
  PRICING = "PRICING",
  FAQ = "FAQ",
  TESTIMONIALS = "TESTIMONIALS",
  CTA = "CTA",
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum ImageCategory {
  PROFILE = "PROFILE",
  COURSE = "COURSE",
  ARTICLE = "ARTICLE",
  BANNER = "BANNER",
  ICON = "ICON",
  OTHER = "OTHER",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  ESSAY = "ESSAY",
}

// ============= INTERFACES =============

export interface User {
  id: string;
  phone: string;
  passwordHash?: string | null;
  phoneVerified: boolean;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  slug?: string | null;
  subject: string;
  title?: string | null;
  description?: string | null;
  categoryId?: string | null;
  level?: string | null;
  language?: string | null;
  price: number;
  discountPercent?: number | null;
  rating?: number | null;
  students?: number | null;
  videosCount?: number | null;
  views?: number | null;
  time?: string | null;
  img?: string | null;
  instructor?: string | null;
  introVideoUrl?: string | null;
  status?: string | null;
  published?: boolean | number | null;
  featured?: boolean | number | null;
  learningGoals?: string[] | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  lessonId?: string | null;
  title?: string | null;
  videoId?: string | null;
  url?: string | null;
  originalPath?: string | null;
  duration?: string | number | null;
  size?: number | null;
  fileSize?: number | null;
  format?: string | null;
  fileFormat?: string | null;
  processingStatus?: string | null;
  hlsSegmentsPath?: string | null;
  hlsPlaylistPath?: string | null;
  thumbnailPath?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface PageContent {
  id: string;
  type: PageContentType;
  content?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DigitalBook {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  filePath?: string | null;
  coverImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessConsulting {
  id?: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  inPersonTitle?: string | null;
  inPersonDescription?: string | null;
  onlineTitle?: string | null;
  onlineDescription?: string | null;
  phoneNumber?: string | null;
  telegramId?: string | null;
  telegramLink?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SkyRoomClass {
  id: string;
  courseId?: string | null;
  title: string;
  description?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  key: string;
  value?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score?: number | null;
  answers?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============= PRISMA NAMESPACE =============

/**
 * PrismaClient stub - No longer used in direct database operations.
 * This class is exported for backward compatibility with existing imports.
 * Use lib/db.ts for MySQL queries instead.
 */
export class PrismaClient {
  newsArticle = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data: any) => [],
    findFirst: async (data: any) => null,
    update: async (data: any) => null,
    delete: async (data: any) => null,
    deleteMany: async (data?: any) => ({ count: 0 }),
    upsert: async (data: any) => null,
    count: async () => 0,
  };

  newsComment = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data: any) => [],
    deleteMany: async (data?: any) => ({ count: 0 }),
    update: async (data: any) => null,
    delete: async (data: any) => null,
    count: async () => 0,
  };

  comment = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data: any) => [],
    deleteMany: async (data?: any) => ({ count: 0 }),
    update: async (data: any) => null,
    delete: async (data: any) => null,
    count: async () => 0,
  };

  user = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data?: any) => [],
    deleteMany: async (data?: any) => ({ count: 0 }),
    upsert: async (data: any) => null,
    update: async (data: any) => null,
    delete: async (data: any) => null,
    count: async () => 0,
  };

  digitalBook = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data: any) => [],
    deleteMany: async (data?: any) => ({ count: 0 }),
    update: async (data: any) => null,
    delete: async (data: any) => null,
    count: async () => 0,
  };

  order = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data: any) => [],
    deleteMany: async (data?: any) => ({ count: 0 }),
    update: async (data: any) => null,
    delete: async (data: any) => null,
    count: async () => 0,
  };

  newsletterSubscriber = {
    create: async (data: any) => null,
    findUnique: async (data: any) => null,
    findMany: async (data: any) => [],
    update: async (data: any) => null,
    delete: async (data: any) => null,
    count: async () => 0,
  };
  
  [key: string]: any;
}

export namespace Prisma {
  // JSON Value type - represents any JSON value
  export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
  export type InputJsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: InputJsonValue };

  // Query types for validation and filtering
  export type UserCreateInput = Partial<User>;
  export type UserUpdateInput = Partial<User>;
  export type CourseCreateInput = Partial<Course>;
  export type CourseUpdateInput = Partial<Course>;
  export type LessonCreateInput = Partial<Lesson>;
  export type LessonUpdateInput = Partial<Lesson>;
  export type CommentCreateInput = Partial<any>;
  export type NewsCommentCreateManyInput = Partial<any>;
  export type CategoryCreateInput = Partial<any>;
  export type TagCreateInput = Partial<any>;
  export type QuizQuestionCreateInput = Partial<any>;
  
  // WhereInput types for filtering (all return empty type for compatibility)
  export type AboutPageWhereInput = Record<string, any>;
  export type BusinessConsultingWhereInput = Record<string, any>;
  export type CategoryWhereInput = Record<string, any>;
  export type CertificateWhereInput = Record<string, any>;
  export type CommentWhereInput = Record<string, any>;
  export type CourseWhereInput = Record<string, any>;
  export type DigitalBookWhereInput = Record<string, any>;
  export type EnrollmentWhereInput = Record<string, any>;
  export type FAQWhereInput = Record<string, any>;
  export type HomeLandingWhereInput = Record<string, any>;
  export type InvestmentPlanWhereInput = Record<string, any>;
  export type InvestmentTagWhereInput = Record<string, any>;
  export type MobileScrollerStepWhereInput = Record<string, any>;
  export type NewsArticleWhereInput = Record<string, any>;
  export type NewsCommentWhereInput = Record<string, any>;
  export type NewsletterSubscriberWhereInput = Record<string, any>;
  export type OrderWhereInput = Record<string, any>;
  export type PageContentWhereInput = Record<string, any>;
  export type QuizAttemptWhereInput = Record<string, any>;
  export type QuizQuestionWhereInput = Record<string, any>;
  export type QuizWhereInput = Record<string, any>;
  export type ResumeItemWhereInput = Record<string, any>;
  export type TagWhereInput = Record<string, any>;
  export type TeamMemberWhereInput = Record<string, any>;
  export type TransactionWhereInput = Record<string, any>;
  export type UserWhereInput = Record<string, any>;

  // Enum filter types - allow string assignment for compatibility
  export type EnumCourseLevelNullableFilter = string | Record<string, any>;
  export type EnumCourseStatusFilter = string | Record<string, any>;
  export type EnumFAQCategoryNullableFilter = string | Record<string, any>;
  export type EnumOrderStatusFilter = string | Record<string, any>;
  export type EnumPageContentTypeFilter = string | Record<string, any>;
  export type EnumTransactionStatusFilter = string | Record<string, any>;
  export type EnumTransactionTypeFilter = string | Record<string, any>;
  export type EnumUserRoleFilter = string | Record<string, any>;
  
  // OrderBy types for sorting (allow string assignment for compatibility)
  export type DigitalBookOrderByWithRelationInput = string | { [key: string]: "asc" | "desc" } | Record<string, any>;
  
  // Error types
  export class PrismaClientKnownRequestError extends Error {
    code?: string;
    clientVersion?: string;
  }
  
  export class PrismaClientValidationError extends Error {
    clientVersion?: string;
  }
}
