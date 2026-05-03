/**
 * Type definitions replacing Prisma Client exports
 * These types are derived from the database schema
 */

// ============= ENUMS =============

export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
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

export enum UserRoleType {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  INSTRUCTOR = "INSTRUCTOR",
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

export namespace Prisma {
  // Query types for validation and filtering
  export type UserCreateInput = Partial<User>;
  export type UserUpdateInput = Partial<User>;
  export type CourseCreateInput = Partial<Course>;
  export type CourseUpdateInput = Partial<Course>;
  export type LessonCreateInput = Partial<Lesson>;
  export type LessonUpdateInput = Partial<Lesson>;
  
  // Error types
  export class PrismaClientKnownRequestError extends Error {
    code?: string;
    clientVersion?: string;
  }
  
  export class PrismaClientValidationError extends Error {
    clientVersion?: string;
  }
}
