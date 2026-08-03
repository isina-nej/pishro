import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HomeLandingUpdateSchema,
  HomeSlideUpsertSchema,
  AboutPageUpdateSchema,
  BusinessConsultingUpdateSchema,
  InvestmentPlansUpdateSchema,
} from "../lib/schemas/landing-cms-schema.ts";

describe("landing CMS schemas", () => {
  it("accepts home landing partial update", () => {
    const parsed = HomeLandingUpdateSchema.safeParse({
      heroTitle: "پیشرو سرمایه",
      calculatorRateLow: 0.07,
      overlayTexts: ["a", "b"],
      published: true,
    });
    assert.equal(parsed.success, true);
  });

  it("rejects empty home slide title", () => {
    const parsed = HomeSlideUpsertSchema.safeParse({
      title: "",
      imageUrl: "/images/x.jpg",
    });
    assert.equal(parsed.success, false);
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
