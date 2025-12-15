// Shared TypeScript types for About Us page components

import type { Prisma } from "@prisma/client";

export interface StatItem {
  label: string;
  value: string | number;
  icon?: string;
}

export interface ResumeItem {
  id: string;
  icon?: string | null;
  title: string;
  description: string;
  color?: string | null;
  bgColor?: string | null;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string | null;
  education?: string | null;
  description?: string | null;
  specialties: string[];
  linkedinUrl?: string | null;
  emailUrl?: string | null;
  twitterUrl?: string | null;
  whatsappUrl?: string | null;
  telegramUrl?: string | null;
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  description?: string | null;
  image: string;
  order: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
}

export interface AboutPageData {
  heroTitle: string;
  heroSubtitle?: string | null;
  heroDescription?: string | null;
  heroBadgeText?: string | null;
  heroStats: Prisma.JsonValue;
  resumeItems: ResumeItem[];
  teamMembers: TeamMember[];
  certificates: Certificate[];
  news: NewsArticle[];
  ctaTitle?: string | null;
  ctaDescription?: string | null;
  ctaButtonText?: string | null;
  ctaButtonLink?: string | null;
}
