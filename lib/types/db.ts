// lib/types/index.ts
// Unified types replacing Prisma types

// Enums
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  COMING_SOON = 'COMING_SOON',
  ARCHIVED = 'ARCHIVED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum Language {
  FA = 'FA',
  EN = 'EN',
}

export enum VideoProcessingStatus {
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export enum ImageCategory {
  PROFILE = 'PROFILE',
  COURSE = 'COURSE',
  BOOK = 'BOOK',
  NEWS = 'NEWS',
  RESUME = 'RESUME',
  CERTIFICATE = 'CERTIFICATE',
  TEAM = 'TEAM',
  LANDING = 'LANDING',
  OTHER = 'OTHER',
}

export enum NewsStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum BlockType {
  TEXT = 'TEXT',
  HEADING = 'HEADING',
  IMAGE = 'IMAGE',
  GALLERY = 'GALLERY',
  QUOTE = 'QUOTE',
  LIST = 'LIST',
}

export enum PortfolioStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// Model Types
export interface User {
  id: string;
  phone: string;
  passwordHash: string;
  phoneVerified: boolean;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  nationalCode?: string | null;
  birthDate?: Date | null;
  avatarUrl?: string | null;
  cardNumber?: string | null;
  shebaNumber?: string | null;
  accountOwner?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Course {
  id: string;
  subject: string;
  price: number;
  img?: string | null;
  rating?: number | null;
  description?: string | null;
  discountPercent?: number | null;
  time?: string | null;
  students?: number | null;
  videosCount?: number | null;
  introVideoUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  categoryId?: string | null;
  slug?: string | null;
  level?: CourseLevel | null;
  language: Language;
  prerequisites: string[];
  learningGoals: string[];
  instructor?: string | null;
  status: CourseStatus;
  published: boolean;
  featured: boolean;
  views: number;
  tagIds: string[];
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  color?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords: string[];
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  heroImage?: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  tagIds: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Order {
  id: string;
  userId?: string | null;
  items: any;
  total: number;
  status: OrderStatus;
  paymentRef?: string | null;
  createdAt?: Date | null;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  videoId?: string | null;
  videoUrl?: string | null;
  thumbnail?: string | null;
  duration?: string | null;
  order: number;
  published: boolean;
  views: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Video {
  id: string;
  title: string;
  description?: string | null;
  videoId: string;
  originalPath: string;
  fileSize: number;
  fileFormat: string;
  duration?: string | null;
  hlsPlaylistPath?: string | null;
  hlsSegmentsPath?: string | null;
  processingStatus: VideoProcessingStatus;
  processingError?: string | null;
  thumbnailPath?: string | null;
  width?: number | null;
  height?: number | null;
  bitrate?: number | null;
  codec?: string | null;
  frameRate?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnail?: string | null;
  status: NewsStatus;
  categoryId?: string | null;
  authorId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  publishedAt?: Date | null;
}

export interface ContentBlock {
  id: string;
  newsId: string;
  type: BlockType;
  content: any;
  sortOrder: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author?: string | null;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date | null;
  views: number;
  featured: boolean;
  readingTime?: number | null;
  likes: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface DigitalBook {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  cover?: string | null;
  publisher?: string | null;
  year: number;
  pages?: number | null;
  isbn?: string | null;
  language: string;
  rating: number;
  votes: number;
  views: number;
  downloads: number;
  category: string;
  formats: string[];
  status: string[];
  tags: string[];
  readingTime?: string | null;
  isFeatured: boolean;
  price?: number | null;
  fileUrl?: string | null;
  audioUrl?: string | null;
  tagIds: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  courseId?: string | null;
  categoryId?: string | null;
  timeLimit?: number | null;
  passingScore: number;
  maxAttempts?: number | null;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  published: boolean;
  order: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  questionType: QuestionType;
  options: any;
  correctAnswer?: boolean | null;
  explanation?: string | null;
  points: number;
  order: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Image {
  id: string;
  title?: string | null;
  description?: string | null;
  alt?: string | null;
  uploadedById: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number | null;
  height?: number | null;
  category: ImageCategory;
  tags: string[];
  published: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt?: Date | null;
  progress: number;
  completedAt?: Date | null;
  lastAccessAt?: Date | null;
}

export interface Comment {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userAvatar?: string | null;
  userRole?: string | null;
  userCompany?: string | null;
  text: string;
  rating?: number | null;
  courseId?: string | null;
  categoryId?: string | null;
  likes: string[];
  dislikes: string[];
  published: boolean;
  verified: boolean;
  featured: boolean;
  views: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface Tag {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  published?: boolean | null;
  categoryIds: string[];
  courseIds: string[];
  newsIds: string[];
  bookIds: string[];
  usageCount: number;
  clicks: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface UserInvestmentPortfolio {
  id: string;
  userId: string;
  portfolioType: string;
  portfolioAmount: number;
  portfolioDuration: number;
  expectedReturn: number;
  monthlyRate: number;
  purchasePrice: number;
  orderId?: string | null;
  status: PortfolioStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  purchasedAt?: Date | null;
  excelFileUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface SiteSettings {
  id: string;
  zarinpalMerchantId?: string | null;
  siteName?: string | null;
  siteDescription?: string | null;
  supportEmail?: string | null;
  supportPhone?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
