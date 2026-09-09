import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  PUBLIC_CONTENT_PAGES,
  getPublicContentDefaults,
  parsePublicContent,
  resolvePublicContent,
  validatePublicContentPage,
} from "@/lib/site/public-content";
import {
  getPublicContent,
  updatePublicContentPage,
  resetPublicContent,
} from "@/lib/services/settings-service";

describe("CMS public content schemas & validation", () => {
  it("exposes all 18 pages with required sections and fields", () => {
    assert.ok(PUBLIC_CONTENT_PAGES.length >= 18);
    const home = PUBLIC_CONTENT_PAGES.find((p) => p.id === "home-v32");
    assert.ok(home);
    assert.ok(home.sections.some((s) => s.id === "hero"));
    assert.ok(home.sections.some((s) => s.id === "trust"));
    assert.ok(home.sections.some((s) => s.id === "audience"));
  });

  it("validates and allows icons, images, links and texts", () => {
    const valid = validatePublicContentPage("home-v32", {
      "hero.title": "عنوان تستی جدید",
      "hero.subtitle": "زیرعنوان تستی",
      "hero.cta": "ثبت‌نام",
      "hero.ctaIcon": "PhoneCall",
      "hero.ctaLink": "/courses",
      "hero.phoneCta": "تماس با پشتیبانی",
      "hero.phoneCtaIcon": "PhoneCall",
      "hero.calculatorCta": "محاسبه سود",
      "hero.calculatorCtaIcon": "Calculator",
      "hero.chip1": "آموزش",
      "hero.chip2": "تضمینی",
      "hero.chip3": "مشاوره",
      "hero.chip4": "پشتیبانی",
      "phone.card1Label": "سرمایه",
      "phone.card1Value": "تضمینی",
      "phone.card2Label": "خودکار",
      "phone.card2Value": "ماهانه",
      "phone.portfolioLabel": "ارزش",
      "phone.portfolioValue": "100",
      "phone.portfolioChange": "+5%",
      "phone.title": "سرمایه",
      "phone.currency": "تومان",
      "phone.confirm": "تایید",
      "phone.confirmIcon": "CheckCircle2",
      "trust.1Title": "کارت ۱",
      "trust.1Text": "توضیح ۱",
      "trust.1Icon": "GraduationCap",
      "trust.2Title": "کارت ۲",
      "trust.2Text": "توضیح ۲",
      "trust.2Icon": "Headphones",
      "trust.3Title": "کارت ۳",
      "trust.3Text": "توضیح ۳",
      "trust.3Icon": "Sparkles",
      "trust.4Title": "کارت ۴",
      "trust.4Text": "توضیح ۴",
      "trust.4Icon": "Award",
      "split.balanceLabel": "موجودی",
      "split.balanceValue": "500",
      "split.row1Label": "سبد ۱",
      "split.row1Value": "+2%",
      "split.row2Label": "سبد ۲",
      "split.row2Value": "+1%",
      "split.title": "نیاز شما",
      "split.description": "توضیحات",
      "split.cta": "شروع",
      "split.ctaIcon": "ArrowLeft",
      "split.ctaLink": "tel:09123456789",
      "audience.title": "مسیر مناسب",
      "audience.subtitle": "توضیحات مسیر",
      "audience.card1": "مبتدی",
      "audience.card1Icon": "GraduationCap",
      "audience.card1Link": "/courses",
      "audience.card2": "معامله‌گر",
      "audience.card2Icon": "TrendingUp",
      "audience.card2Link": "/investment-plans",
      "audience.card3": "سبد",
      "audience.card3Icon": "PieChart",
      "audience.card3Link": "/investment-plans",
      "audience.card4": "مشاوره",
      "audience.card4Icon": "Briefcase",
      "audience.card4Link": "/business-consulting",
    });

    assert.ok(valid);
    assert.equal(valid["hero.title"], "عنوان تستی جدید");
    assert.equal(valid["trust.1Icon"], "GraduationCap");
  });

  it("rejects invalid links like javascript: protocol", () => {
    const defaults = getPublicContentDefaults("home-v32")["home-v32"];
    const invalid = validatePublicContentPage("home-v32", {
      ...defaults,
      "hero.ctaLink": "javascript:alert(1)",
    });
    assert.equal(invalid, null);
  });

  it("rejects invalid icon names with dangerous characters", () => {
    const defaults = getPublicContentDefaults("home-v32")["home-v32"];
    const invalid = validatePublicContentPage("home-v32", {
      ...defaults,
      "trust.1Icon": "Invalid Icon Name With Spaces!",
    });
    assert.equal(invalid, null);
  });

  it("merges overrides cleanly into defaults", () => {
    const resolved = resolvePublicContent({
      "home-v32": {
        "hero.title": "عنوان اختصاصی",
      },
    });

    assert.equal(resolved["home-v32"]["hero.title"], "عنوان اختصاصی");
    assert.equal(resolved["home-v32"]["hero.subtitle"], "پیشرو در آموزش و سرمایه‌گذاری");
  });
});

describe("CMS database round-trip", () => {
  it("reads, updates, and resets publicContent in database", async () => {
    try {
      const initial = await getPublicContent();
      assert.ok(initial);
      const originalTitle = initial["home-v32"]?.["hero.title"] || "پیشرو سرمایه";

      // Update test field
      const testTitle = `${originalTitle} · CMS_TEST`;
      const updated = await updatePublicContentPage("home-v32", {
        "hero.title": testTitle,
      });
      assert.equal(updated["home-v32"]["hero.title"], testTitle);

      // Verify read-back
      const readBack = await getPublicContent();
      assert.equal(readBack["home-v32"]["hero.title"], testTitle);

      // Reset test page back to original
      await resetPublicContent("home-v32");
      const afterReset = await getPublicContent();
      assert.equal(afterReset["home-v32"]["hero.title"], "پیشرو سرمایه");
    } catch (e) {
      // getSettings() swallows the Prisma error into a generic Persian message,
      // so detect offline-DB by probing the connection directly.
      let offline = false;
      try {
        const { prisma } = await import("@/lib/prisma");
        await prisma.$queryRaw`SELECT 1`;
      } catch {
        offline = true;
      } finally {
        try {
          const { prisma } = await import("@/lib/prisma");
          await prisma.$disconnect();
        } catch {
          // ignore disconnect errors
        }
      }
      if (offline) {
        console.log("SKIP: Database offline in test environment");
        return;
      }
      throw e;
    }
  });
});
