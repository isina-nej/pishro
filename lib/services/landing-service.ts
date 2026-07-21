// @/lib/services/landing-service.ts

import * as db from "@/lib/db";
import { prisma } from "@/lib/prisma";

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
    const [homeLanding] = await db.query<any>(
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
    const steps = await db.query<any>(
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
    const slides = await db.query<any>(
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
    const params: any[] = [];

    if (row !== undefined) {
      query += ` AND \`row\` = ?`;
      params.push(row);
    }

    query += ` ORDER BY \`order\` ASC`;

    const sliders = await db.query<any>(query, params);
    return sliders || [];
  } catch (error) {
    logLandingError("getHomeMiniSliders", error);
    return [];
  }
}

// ==================== ABOUT PAGE ====================

export async function getAboutPageData() {
  try {
    const [aboutPage] = await db.query<any>(
      `SELECT * FROM AboutPage WHERE published = true LIMIT 1`
    );

    if (!aboutPage) return null;

    const resumeItems = await db.query<any>(
      `SELECT * FROM ResumeItem WHERE published = true AND aboutPageId = ? ORDER BY \`order\` ASC`,
      [aboutPage.id]
    );

    const teamMembers = await db.query<any>(
      `SELECT * FROM TeamMember WHERE published = true AND aboutPageId = ? ORDER BY \`order\` ASC`,
      [aboutPage.id]
    );

    const certificates = await db.query<any>(
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
    const [data] = await db.query<any>(
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
    const [data] = await db.query<any>(
      `SELECT * FROM InvestmentPlans WHERE published = true LIMIT 1`
    );

    if (!data) return null;

    const plans = await db.query<any>(
      `SELECT * FROM InvestmentPlan WHERE published = true AND investmentPlansId = ? ORDER BY \`order\` ASC`,
      [data.id]
    );

    const tags = await db.query<any>(
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
