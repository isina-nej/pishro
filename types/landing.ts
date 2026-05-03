// @/types/landing.ts

/**
 * Types for landing pages data
 */

// ==================== HOME LANDING ====================

export interface HomeLandingData {
  id: string;
  // Main Hero
  mainHeroTitle: string | null;
  mainHeroSubtitle: string | null;
  mainHeroCta1Text: string | null;
  mainHeroCta1Link: string | null;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string | null;
  heroDescription: string | null;
  heroVideoUrl: string | null;
  heroCta1Text: string | null;
  heroCta1Link: string | null;

  // Overlay Texts
  overlayTexts: string[];

  // Stats
  statsData: StatItem[];

  // Why Us Section
  whyUsTitle: string | null;
  whyUsDescription: string | null;
  whyUsItems: WhyUsItem[];

  // Newsletter/News Club
  newsClubTitle: string | null;
  newsClubDescription: string | null;

  // Calculator Section
  calculatorTitle: string | null;
  calculatorDescription: string | null;
  calculatorRateLow: number | null;
  calculatorRateMedium: number | null;
  calculatorRateHigh: number | null;
  calculatorPortfolioLowDesc: string | null;
  calculatorPortfolioMediumDesc: string | null;
  calculatorPortfolioHighDesc: string | null;
  calculatorAmountSteps: number[];
  calculatorDurationSteps: number[];
  calculatorInPersonPhone: string | null;
  calculatorOnlineTelegram: string | null;
  calculatorOnlineTelegramLink: string | null;

  // Meta
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];

  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface WhyUsItem {
  label: string;
  title: string;
  text: string;
  btnLabel?: string;
  btnHref?: string;
  imagePath?: string;
}

// ==================== MOBILE SCROLLER STEPS ====================

export interface MobileScrollerStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  imageUrl: string | null;
  coverImageUrl: string | null;
  gradient: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== ABOUT PAGE ====================

export interface AboutPageData {
  id: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string | null;
  heroDescription: string | null;
  heroBadgeText: string | null;
  heroStats: HeroStat[];

  // Resume Section
  resumeTitle: string | null;
  resumeSubtitle: string | null;
  resumeItems: ResumeItem[];

  // Team Section
  teamTitle: string | null;
  teamSubtitle: string | null;
  teamMembers: TeamMember[];

  // Certificates Section
  certificatesTitle: string | null;
  certificatesSubtitle: string | null;
  certificates: Certificate[];

  // News Section
  newsTitle: string | null;
  newsSubtitle: string | null;
  news: NewsArticle[];

  // CTA Section
  ctaTitle: string | null;
  ctaDescription: string | null;
  ctaButtonText: string | null;
  ctaButtonLink: string | null;

  // Meta
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];

  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroStat {
  label: string;
  value: number;
  icon?: string;
}

export interface ResumeItem {
  id: string;
  icon: string | null;
  title: string;
  description: string;
  color: string | null;
  bgColor: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string | null;
  education: string | null;
  description: string | null;
  specialties: string[];
  linkedinUrl: string | null;
  emailUrl: string | null;
  twitterUrl: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  description: string | null;
  image: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string | null;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  views: number;
  featured: boolean;
  readingTime: number | null;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== INVESTMENT CONSULTING ====================

export interface BusinessConsultingData {
  id: string;

  // Landing Content
  title: string;
  description: string;
  image: string | null;

  // Contact Information
  phoneNumber: string | null;
  telegramId: string | null;
  telegramLink: string | null;
  coursesLink: string | null;

  // Drawer Content
  inPersonTitle: string | null;
  inPersonDescription: string | null;
  onlineTitle: string | null;
  onlineDescription: string | null;
  coursesTitle: string | null;
  coursesDescription: string | null;

  // Meta
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];

  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== INVESTMENT PLANS ====================

export interface InvestmentPlansData {
  id: string;

  // Landing Content
  title: string;
  description: string;
  image: string | null;

  // Investment Plan Types
  plans: InvestmentPlan[];

  // Investment Tags
  tags: InvestmentTag[];

  // Intro Cards
  plansIntroCards: PlansIntroCard[];

  // Settings
  minAmount: number;
  maxAmount: number;
  amountStep: number;

  // Meta
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];

  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentPlan {
  id: string;
  label: string;
  icon: string | null;
  description: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentTag {
  id: string;
  title: string;
  color: string | null;
  icon: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlansIntroCard {
  title: string;
  description: string;
}

// ==================== INVESTMENT MODELS ====================

export interface InvestmentModelsPageData {
  id: string;

  // Models
  models: InvestmentModelData[];

  // Additional Info
  additionalInfoTitle: string | null;
  additionalInfoContent: string | null;

  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentModelData {
  id: string;
  type: string; // "in-person" | "online"
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;

  // Features - JSON array
  features: InvestmentModelFeature[];

  // Benefits - String array
  benefits: string[];

  // CTA
  ctaText: string;
  ctaLink: string | null;
  ctaIsScroll: boolean;

  // Contact Info
  contactTitle: string | null;
  contactDescription: string | null;
  contacts: InvestmentModelContact[];

  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentModelFeature {
  icon: string;
  title: string;
  description: string;
}

export interface InvestmentModelContact {
  icon: string;
  title: string;
  value: string;
  link?: string;
}

// ==================== API RESPONSES ====================

export interface HomeLandingResponse {
  landing: HomeLandingData;
  mobileSteps: MobileScrollerStep[];
}
