/**
 * Integration-style checks for landing CMS persistence (no HTTP server required).
 */
import "dotenv/config";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { HomeLandingUpdateSchema } from "../lib/schemas/landing-cms-schema.ts";

const prisma = new PrismaClient();

describe("landing CMS database round-trip", () => {
  let landingId: string | null = null;
  let originalTitle: string | null = null;

  before(async () => {
    const landing = await prisma.homeLanding.findFirst({ orderBy: { order: "asc" } });
    if (!landing) {
      return;
    }
    landingId = landing.id;
    originalTitle = landing.newsClubTitle;
  });

  after(async () => {
    if (landingId && originalTitle != null) {
      await prisma.homeLanding.update({
        where: { id: landingId },
        data: { newsClubTitle: originalTitle },
      });
    }
    await prisma.$disconnect();
  });

  it("updates and restores HomeLanding.newsClubTitle", async () => {
    if (!landingId) {
      console.log("SKIP: no HomeLanding row — run npm run seed first");
      return;
    }

    const nextTitle = `${originalTitle} · CMS-TEST`;
    const parsed = HomeLandingUpdateSchema.safeParse({ newsClubTitle: nextTitle });
    assert.equal(parsed.success, true);

    const updated = await prisma.homeLanding.update({
      where: { id: landingId },
      data: { newsClubTitle: nextTitle },
    });
    assert.equal(updated.newsClubTitle, nextTitle);

    const steps = await prisma.mobileScrollerStep.count();
    const about = await prisma.aboutPage.count();
    const consulting = await prisma.businessConsulting.count();
    const plans = await prisma.investmentPlans.count();

    assert.ok(steps >= 0);
    assert.ok(about >= 1);
    assert.ok(consulting >= 1);
    assert.ok(plans >= 1);
  });
});
