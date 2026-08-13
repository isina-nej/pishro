import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HomeLandingUpdateSchema,
  AboutPageUpdateSchema,
  BusinessConsultingUpdateSchema,
  InvestmentPlansUpdateSchema,
} from "../lib/schemas/landing-cms-schema.ts";

describe("landing CMS schemas", () => {
  it("accepts home landing partial update", () => {
    const parsed = HomeLandingUpdateSchema.safeParse({
      calculatorRateLow: 0.07,
      newsClubTitle: "باشگاه",
      published: true,
    });
    assert.equal(parsed.success, true);
  });

  it("accepts about page update", () => {
    const parsed = AboutPageUpdateSchema.safeParse({
      heroTitle: "درباره ما",
      ctaButtonLink: "/courses",
    });
    assert.equal(parsed.success, true);
  });

  it("accepts business consulting update", () => {
    const parsed = BusinessConsultingUpdateSchema.safeParse({
      title: "مشاوره",
      description: "توضیحات کافی برای صفحه مشاوره کسب و کار",
      phoneNumber: "0911",
    });
    assert.equal(parsed.success, true);
  });

  it("accepts investment plans update", () => {
    const parsed = InvestmentPlansUpdateSchema.safeParse({
      title: "سبدها",
      minAmount: 10,
      maxAmount: 1000,
    });
    assert.equal(parsed.success, true);
  });
});
