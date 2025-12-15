// @/lib/services/landing-service.ts

import { prisma } from "@/lib/prisma";

/**
 * Service for fetching landing page data
 */

// ==================== HOME LANDING ====================

export async function getHomeLandingData() {
  try {
    const homeLanding = await prisma.homeLanding.findFirst({
      where: { published: true },
      orderBy: { order: "asc" },
    });

    return homeLanding;
  } catch (error) {
    console.error("Error fetching home landing data:", error);
    return null;
  }
}

export async function getMobileScrollerSteps() {
  try {
    const steps = await prisma.mobileScrollerStep.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });

    return steps;
  } catch (error) {
    console.error("Error fetching mobile scroller steps:", error);
    return [];
  }
}

export async function getHomeSlides() {
  try {
    const slides = await prisma.homeSlide.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });

    return slides;
  } catch (error) {
    console.error("Error fetching home slides:", error);
    return [];
  }
}

export async function getHomeMiniSliders(row?: number) {
  try {
    const sliders = await prisma.homeMiniSlider.findMany({
      where: {
        published: true,
        ...(row && { row }),
      },
      orderBy: { order: "asc" },
    });

    return sliders;
  } catch (error) {
    console.error("Error fetching home mini sliders:", error);
    return [];
  }
}

// ==================== ABOUT PAGE ====================

export async function getAboutPageData() {
  try {
    const aboutPage = await prisma.aboutPage.findFirst({
      where: { published: true },
      include: {
        resumeItems: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
        teamMembers: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
        certificates: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
        news: {
          where: { published: true },
          take: 3,
          orderBy: { publishedAt: "desc" },
        },
      },
    });

    return aboutPage;
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return null;
  }
}

// ==================== BUSINESS CONSULTING ====================

export async function getBusinessConsultingData() {
  try {
    const data = await prisma.businessConsulting.findFirst({
      where: { published: true },
    });

    return data;
  } catch (error) {
    console.error("Error fetching business consulting data:", error);
    return null;
  }
}

// ==================== INVESTMENT PLANS ====================

export async function getInvestmentPlansData() {
  try {
    const data = await prisma.investmentPlans.findFirst({
      where: { published: true },
      include: {
        plans: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
        tags: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching investment plans data:", error);
    return null;
  }
}
