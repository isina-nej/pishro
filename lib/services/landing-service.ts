// @/lib/services/landing-service.ts

import * as db from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type {
  HomeLanding,
  MobileScrollerStep,
  HomeSlide,
  HomeMiniSlider,
  AboutPage,
  Certificate,
  BusinessConsulting,
  InvestmentPlans,
  InvestmentPlan,
  InvestmentTag,
} from "@prisma/client";
import type {
  ResumeItem,
  TeamMember,
} from "@/types/about-us";

/**
 * Row shapes for the landing tables.
 *
 * These tables are read with raw SQL, and mysql2 hands MySQL `Json` columns
 * back already parsed. Prisma types those columns as the much wider
 * `JsonValue`, so the ones the pages actually consume are narrowed here to
 * their real runtime shape; the rest keep Prisma's type.
 */
type HomeLandingRow = Omit<HomeLanding, "metaKeywords" | "overlayTexts"> & {
  metaKeywords: string[] | null;
  overlayTexts: string[] | null;
};

type AboutPageRow = Omit<AboutPage, "metaKeywords"> & {
  metaKeywords: string[] | null;
};

type BusinessConsultingRow = Omit<BusinessConsulting, "metaKeywords"> & {
  metaKeywords: string[] | null;
};

type InvestmentPlansRow = Omit<InvestmentPlans, "metaKeywords"> & {
  metaKeywords: string[] | null;
};

/**
 * Service for fetching landing page data
 * Uses raw MySQL for landing tables and Prisma singleton for recent news.
 */

function logLandingError(scope: string, error: unknown) {
  console.error(`[landing-service] ${scope} failed`, error);
}

// ==================== HOME LANDING ====================

export async function getHomeLandingData() {
  try {
    const [homeLanding] = await db.query<HomeLandingRow>(
      `SELECT * FROM HomeLanding WHERE published = true ORDER BY \`order\` ASC LIMIT 1`
    );
    return homeLanding || null;
  } catch (error) {
    logLandingError("getHomeLandingData", error);
    return null;
  }
}

export async function getMobileScrollerSteps() {
  try {
    const steps = await db.query<MobileScrollerStep>(
      `SELECT * FROM MobileScrollerStep WHERE published = true ORDER BY \`order\` ASC`
    );
    return steps || [];
  } catch (error) {
    logLandingError("getMobileScrollerSteps", error);
    return [];
  }
}

export async function getHomeSlides() {
  try {
    const slides = await db.query<HomeSlide>(
      `SELECT * FROM HomeSlide WHERE published = true ORDER BY \`order\` ASC`
    );
    return slides || [];
  } catch (error) {
    logLandingError("getHomeSlides", error);
    return [];
  }
}

export async function getHomeMiniSliders(row?: number) {
  try {
    let query = `SELECT * FROM HomeMiniSlider WHERE published = true`;
    const params: db.QueryValues = [];

    if (row !== undefined) {
      query += ` AND \`row\` = ?`;
      params.push(row);
    }

    query += ` ORDER BY \`order\` ASC`;

    const sliders = await db.query<HomeMiniSlider>(query, params);
    return sliders || [];
  } catch (error) {
    logLandingError("getHomeMiniSliders", error);
    return [];
  }
}

// ==================== ABOUT PAGE ====================

export async function getAboutPageData() {
  try {
    const [aboutPage] = await db.query<AboutPageRow>(
      `SELECT * FROM AboutPage WHERE published = true LIMIT 1`
    );

    if (!aboutPage) return null;

    const resumeItems = await db.query<ResumeItem>(
      `SELECT * FROM ResumeItem WHERE published = true AND aboutPageId = ? ORDER BY \`order\` ASC`,
      [aboutPage.id]
    );

    const teamMembers = await db.query<TeamMember>(
      `SELECT * FROM TeamMember WHERE published = true AND aboutPageId = ? ORDER BY \`order\` ASC`,
      [aboutPage.id]
    );

    const certificates = await db.query<Certificate>(
      `SELECT * FROM Certificate WHERE published = true AND aboutPageId = ? ORDER BY \`order\` ASC`,
      [aboutPage.id]
    );

    const news = await prisma.newsArticle.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
      },
    });

    return {
      ...aboutPage,
      resumeItems,
      teamMembers,
      certificates,
      news,
    };
  } catch (error) {
    logLandingError("getAboutPageData", error);
    return null;
  }
}

// ==================== BUSINESS CONSULTING ====================

export async function getBusinessConsultingData() {
  try {
    const [data] = await db.query<BusinessConsultingRow>(
      `SELECT * FROM BusinessConsulting WHERE published = true LIMIT 1`
    );
    return data || null;
  } catch (error) {
    logLandingError("getBusinessConsultingData", error);
    return null;
  }
}

// ==================== INVESTMENT PLANS ====================

export async function getInvestmentPlansData() {
  try {
    const [data] = await db.query<InvestmentPlansRow>(
      `SELECT * FROM InvestmentPlans WHERE published = true LIMIT 1`
    );

    if (!data) return null;

    const plans = await db.query<InvestmentPlan>(
      `SELECT * FROM InvestmentPlan WHERE published = true AND investmentPlansId = ? ORDER BY \`order\` ASC`,
      [data.id]
    );

    const tags = await db.query<InvestmentTag>(
      `SELECT * FROM InvestmentTag WHERE published = true AND investmentPlansId = ? ORDER BY \`order\` ASC`,
      [data.id]
    );

    return {
      ...data,
      plans,
      tags,
    };
  } catch (error) {
    logLandingError("getInvestmentPlansData", error);
    return null;
  }
}
